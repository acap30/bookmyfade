from fastapi import HTTPException, status

from db import schemas
from sqlalchemy.orm.session import Session
from db.models import WorkingHours, Hairdresser

def create_working_hours(req: schemas.WorkingHoursCreate, db: Session):
    existing_hairdresser = db.query(Hairdresser).filter(req.hairdresser_id == Hairdresser.id).first()
    if not existing_hairdresser:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    new_wh = WorkingHours(
        hairdresser_id = req.hairdresser_id,
        weekday = req.weekday,
        start = req.start if req.off == 0 else None,
        end = req.end if req.off == 0 else None,
        off = req.off
    )

    db.add(new_wh)
    db.commit()
    db.refresh(new_wh)

    return {"message": "Good."}

def create_working_hours_week(req: schemas.WorkingHoursWeekCreate, db: Session):
    existing_hairdresser = db.query(Hairdresser).filter(req.hairdresser_id == Hairdresser.id).first()
    if not existing_hairdresser:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    days = req.model_dump(exclude={"hairdresser_id"})

    

    for weekday, schedule in days.items():
        sch = schemas.WorkingHoursCreate(
            hairdresser_id = req.hairdresser_id,
            weekday = schemas.Weekday(weekday),
            off = schedule["off"],
            start = schedule["start"] if schedule["off"] == 0 else None,
            end = schedule["end"] if schedule["off"] == 0 else None,
            
        )
        create_working_hours(sch, db)

    return {"message": "good"}


def get_all_working_hours(db: Session):

    return db.query(WorkingHours).all()

def get_working_hours_by_id(id: int, db: Session):

    wh = db.query(WorkingHours).filter(id == WorkingHours.id).first()

    if not wh:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    return wh

def get_working_hours_by_hairdresser_id(hd_id: int, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser doesn't exist")


    wh_list = db.query(WorkingHours).filter(WorkingHours.hairdresser_id == hd_id).all()

    if not wh_list:
        off = schemas.DaySchedule(off=True)
        return schemas.WorkingHoursWeekCreate(
            hairdresser_id=hd_id,
            monday=off,
            tuesday=off,
            wednesday=off,
            thursday=off,
            friday=off,
            saturday=off,
            sunday=off
        )
    
    weekday_map = {}
    for wh in wh_list:
        weekday_map[wh.weekday] = {
            "start": wh.start,
            "end":wh.end,
            "off":wh.off
        }
    
    return {
        "hairdresser_id": hd_id,
        "monday": weekday_map.get("monday"),
        "tuesday": weekday_map.get("tuesday"),
        "wednesday": weekday_map.get("wednesday"),
        "thursday": weekday_map.get("thursday"),
        "friday": weekday_map.get("friday"),
        "saturday": weekday_map.get("saturday"),
        "sunday": weekday_map.get("sunday"),
    }


def update_working_hours_by_id(id: int, req: schemas.WorkingHoursUpdate, db: Session):

    wh = db.query(WorkingHours).filter(id == WorkingHours.id).first()

    if not wh:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    wh.weekday = req.weekday if req.weekday is not None else wh.weekday
    wh.start = req.start if req.start is not None else wh.start
    wh.end = req.end if req.end is not None else wh.end

    db.commit()
    db.refresh(wh)

    return {"message": "Updated successfully"}

def update_working_hours_by_hairdresser_id(hd_id: int, req: schemas.WorkingHoursUpdate, db: Session):
    wh_list = db.query(WorkingHours).filter(WorkingHours.hairdresser_id == hd_id).all()

    if not wh_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    wh_map = {wh.weekday: wh for wh in wh_list}

    for day_name, day_schedule in req.__dict__.items():
        if day_schedule is None:
            continue

        weekday_enum = schemas.Weekday(day_name)

        wh = wh_map[weekday_enum]

        wh.off = day_schedule.off
        if wh.off == 0:
            wh.start = day_schedule.start if day_schedule.start is not None else wh.start
            wh.end = day_schedule.end if day_schedule.end is not None else wh.end
        else:
            wh.start = None
            wh.end = None
            

    db.commit()

    for wh in wh_map.values():
        db.refresh(wh)

    return {
        "hairdresser_id": hd_id,
        "monday": wh_map.get("monday"),
        "tuesday": wh_map.get("tuesday"),
        "wednesday": wh_map.get("wednesday"),
        "thursday": wh_map.get("thursday"),
        "friday": wh_map.get("friday"),
        "saturday": wh_map.get("saturday"),
        "sunday": wh_map.get("sunday"),
    }



def delete_working_hours(id: int, db: Session):
    
    wh = db.query(WorkingHours).filter(id == WorkingHours.id).first()

    if not wh:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    db.delete(wh)
    db.commit()

    return {"message": "Deleted successfully"}
from db import schemas
from sqlalchemy.orm.session import Session
from db.models import Salon, WorkingHoursSalon
from fastapi import HTTPException, status


def create_wh_salon(req: schemas.WorkingHoursSalonWeekCreate, db: Session):
    existing_salon = db.query(Salon).filter(req.salon_id == Salon.id).first()
    if not existing_salon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    days = req.model_dump(exclude={"salon_id"})

    

    for weekday, schedule in days.items():
       
        new_wh = WorkingHoursSalon(
            salon_id=req.salon_id,
            weekday = schemas.Weekday(weekday),
            day_off = schedule["off"],
            start = schedule["start"] if schedule["off"] == 0 else None,
            end = schedule["end"] if schedule["off"] == 0 else None,
        )

        db.add(new_wh)
        db.commit()
        db.refresh(new_wh)
        

    return {"message": "good"}

def get_wh_by_salon_id(salon_id: int, db: Session):

    existing_salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not existing_salon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    

    wh_list = db.query(WorkingHoursSalon).filter(WorkingHoursSalon.salon_id==salon_id).all()

    if not wh_list:
        off = schemas.DaySchedule(off=True)
        return schemas.WorkingHoursSalonWeekCreate(
            salon_id=salon_id,
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
            "off":wh.day_off
        }
    

    return schemas.WorkingHoursSalonWeekCreate(
            salon_id=salon_id,
            monday=weekday_map.get("monday"),
            tuesday=weekday_map.get("tuesday"),
            wednesday=weekday_map.get("wednesday"),
            thursday=weekday_map.get("thursday"),
            friday=weekday_map.get("friday"),
            saturday=weekday_map.get("saturday"),
            sunday=weekday_map.get("sunday")
        )


def update_working_hours_by_salon_id(salon_id: int, req: schemas.WorkingHoursUpdate, db: Session):

    hd = db.query(Salon).filter(Salon.id == salon_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser doesn't exist")
    
    wh_list = db.query(WorkingHoursSalon).filter(WorkingHoursSalon.salon_id == salon_id).all()

    if not wh_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    wh_map = {wh.weekday: wh for wh in wh_list}

    for day_name, day_schedule in req.__dict__.items():
        if day_schedule is None:
            continue

        weekday_enum = schemas.Weekday(day_name)

        wh = wh_map[weekday_enum]

        wh.day_off = day_schedule.off
        if wh.day_off == 0:
            wh.start = day_schedule.start if day_schedule.start is not None else wh.start
            wh.end = day_schedule.end if day_schedule.end is not None else wh.end
        else:
            wh.start = None
            wh.end = None
            

    db.commit()

    for wh in wh_map.values():
        db.refresh(wh)

    return {
        "salon_id": salon_id,
        "monday": wh_map.get("monday"),
        "tuesday": wh_map.get("tuesday"),
        "wednesday": wh_map.get("wednesday"),
        "thursday": wh_map.get("thursday"),
        "friday": wh_map.get("friday"),
        "saturday": wh_map.get("saturday"),
        "sunday": wh_map.get("sunday"),
    }
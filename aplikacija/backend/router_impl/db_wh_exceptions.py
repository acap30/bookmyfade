from db import schemas
from sqlalchemy.orm.session import Session
from db.models import WorkingHoursExceptions
from fastapi import HTTPException, status
from datetime import timedelta



def create_wh_exception(req: schemas.WorkingHoursExceptionCreate, db: Session):
    
    new_exception = WorkingHoursExceptions(
        hairdresser_id = req.hairdresser_id,
        date = req.date,
        start = req.start,
        end = req.end,
        day_off = req.day_off,
        detail = req.detail
    )

    db.add(new_exception)
    db.commit()
    db.refresh(new_exception)

    return {"exception_id", new_exception.id}

def create_days_off(req: schemas.DaysOffCreate, db: Session):

    current = req.start
    while current <= req.end:
        create_wh_exception(schemas.WorkingHoursExceptionCreate(
            hairdresser_id=req.hairdresser_id,
            date=current,
            day_off=True,
            detail=req.detail
        ), db)
        current += timedelta(days=1)

    return {"message": "good"}

def get_all_exceptions(db: Session):

    query = db.query(WorkingHoursExceptions).all()

    return query

def get_all_exceptions_hairdresser_id(hd_id: int, db: Session):

    exceptions = db.query(WorkingHoursExceptions).filter(WorkingHoursExceptions.hairdresser_id == hd_id).all()

    if not exceptions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    return {
        "hairdresser_id": hd_id,
        "exceptions": [{
            "id": e.id,
            "date": e.date,
            "start": e.start,
            "end": e.end,
            "day_off": e.day_off,
            "detail": e.detail
        }
        for e in exceptions
        ]
    }

def get_all_off_days_hairdresser_id(hd_id: int, db: Session):
    days_off = (
        db.query(WorkingHoursExceptions)
        .filter(WorkingHoursExceptions.hairdresser_id == hd_id,
                 WorkingHoursExceptions.day_off == True)
                 .order_by(WorkingHoursExceptions.date)
                 .all()
                 )

    if not days_off:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    days = []

    start_date = days_off[0].date
    end_date = days_off[0].date
    detail = days_off[0].detail

    for day in days_off[1:]:
        if day.detail == detail and day.date == end_date + timedelta(days=1):
            end_date = day.date
        else:
            days.append(
                schemas.DayOff(
                    start_date=start_date,
                    end_date=end_date,
                    detail=detail
                )
            )

            start_date=day.date
            end_date=day.date
            detail=day.detail

    days.append(
        schemas.DayOff(
            start_date=start_date,
            end_date=end_date,
            detail=detail
        )
    )
    return schemas.DaysOffDisplay(
        hairdresser_id=hd_id,
        days=days
    )

def update_exception_by_id(id: int, req: schemas.WorkingHoursExceptionUpdate, db: Session):

    exception = db.query(WorkingHoursExceptions).filter(WorkingHoursExceptions.id == id).first()

    if not exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    exception.start = req.start if req.start is not None else exception.start
    exception.end = req.end if req.end is not None else exception.end
    exception.day_off = req.day_off if req.day_off is not None else exception.day_off
    exception.detail = req.detail if req.detail is not None else exception.detail

    db.commit()
    db.refresh(exception)

    return exception

def delete_exception(exception_id: int, db: Session):

    exception = db.query(WorkingHoursExceptions).filter(WorkingHoursExceptions.id == exception_id).first()

    if not exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    db.delete(exception)
    db.commit()

    return {"message": "good"}

def delete_days_off(hd_id: int, req: schemas.DaysOffDelete, db: Session):
    days_off = (
        db.query(WorkingHoursExceptions)
        .filter(WorkingHoursExceptions.hairdresser_id == hd_id,
                WorkingHoursExceptions.day_off == True,
                WorkingHoursExceptions.date >= req.start,
                WorkingHoursExceptions.date <= req.end)
        .order_by(WorkingHoursExceptions.date)
        .all()
        )

    if not days_off:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    for d in days_off:
        delete_exception(d.id, db)

    return {"message": "good"}

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
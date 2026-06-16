from db import schemas
from sqlalchemy.orm.session import Session
from db.models import WorkingHoursExceptions
from fastapi import HTTPException, status



def create_wh_exception(req: schemas.WorkingHoursExceptionCreate, db: Session):
    
    new_exception = WorkingHoursExceptions(
        hairdresser_id = req.hairdresser_id,
        date = req.date,
        start = req.start,
        end = req.end,
        day_off = req.day_off
    )

    db.add(new_exception)
    db.commit()
    db.refresh(new_exception)

    return {"exception_id", new_exception.id}

def get_all_exceptions(db: Session):

    query = db.query(WorkingHoursExceptions).all()

    return query

def delete_exception(exception_id: int, db: Session):

    exception = db.query(WorkingHoursExceptions).filter(WorkingHoursExceptions.id == exception_id).first()

    if not exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    db.delete(exception)
    db.commit()

    return {"message": "good"}
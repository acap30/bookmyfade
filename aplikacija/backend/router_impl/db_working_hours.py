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
        start = req.start,
        end = req.end
    )

    db.add(new_wh)
    db.commit()
    db.refresh(new_wh)

    return {"message": "Good."}

def get_all_working_hours(db: Session):

    return db.query(WorkingHours).all()

def get_working_hours_by_id(id: int, db: Session):

    wh = db.query(WorkingHours).filter(id == WorkingHours.id).first()

    if not wh:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    return wh

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

def delete_working_hours(id: int, db: Session):
    
    wh = db.query(WorkingHours).filter(id == WorkingHours.id).first()

    if not wh:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Working Hours not found.")
    
    db.delete(wh)
    db.commit()

    return {"message": "Deleted successfully"}
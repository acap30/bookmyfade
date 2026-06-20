from typing import List

from fastapi import APIRouter, Depends
from db import schemas
from sqlalchemy.orm.session import Session
from db.database import get_db
from auth.oauth2 import get_current_user
from router_impl import db_wh_exceptions



router = APIRouter(
    tags=["working_hours_exceptions"],
    prefix="/workhours/exceptions"
)

@router.post("/")
def create_wh_exception(req: schemas.WorkingHoursExceptionCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.create_wh_exception(req, db)

@router.post("/off/")
def create_days_off(req: schemas.DaysOffCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.create_days_off(req, db)

@router.get("/", response_model=List[schemas.WorkingHoursExceptionDisplay])
def get_all_exceptions(db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.get_all_exceptions(db)

@router.get("/hairdresser/{id}")
def get_all_exceptions_by_hairdresser_id(hd_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.get_all_exceptions_hairdresser_id(hd_id, db)

@router.get("/hairdresser/{id}/off")
def get_all_off_days_by_hairdresser_id(hd_id, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.get_all_off_days_hairdresser_id(hd_id, db)

@router.put("/{exception_id}", response_model=schemas.WorkingHoursExceptionDisplay)
def update_exception_by_id(id: int, req: schemas.WorkingHoursExceptionUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.update_exception_by_id(id, req, db)

@router.delete("/{exception_id}")
def delete_exception(exception_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.delete_exception(exception_id, db)

@router.delete("/hairdresser/{hairdresser_id}/off/")
def delete_days_off(hd_id: int, req: schemas.DaysOffDelete, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.delete_days_off(hd_id, req, db)

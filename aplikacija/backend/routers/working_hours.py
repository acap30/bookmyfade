from fastapi import APIRouter, Depends
from db import schemas
from sqlalchemy.orm.session import Session
from db.database import get_db
from auth.oauth2 import get_current_user
from router_impl import db_working_hours



router = APIRouter(
    tags=["working_hours"],
    prefix="/workhours"
)


@router.post("/")
def create_working_hours(req: schemas.WorkingHoursCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.create_working_hours(req,db)

@router.post("/week/")
def create_wokring_hours_week(req: schemas.WorkingHoursWeekCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.create_working_hours_week(req, db)

@router.get("/")
def get_all_working_hours(db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.get_all_working_hours(db)

@router.get("/{id}")
def get_working_hours_by_id(id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.get_working_hours_by_id(id, db)

@router.put("/{id}")
def update_working_hours_by_id(id: int, req: schemas.WorkingHoursUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.update_working_hours_by_id(id, req, db)

@router.delete("/{id}")
def delete_working_hours(id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_working_hours.delete_working_hours(id, db)
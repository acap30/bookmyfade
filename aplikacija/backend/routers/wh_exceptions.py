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

@router.get("/", response_model=List[schemas.WorkingHoursExceptionDisplay])
def get_all_exceptions(db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.get_all_exceptions(db)

@router.delete("/{exception_id}")
def delete_exception(exception_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_exceptions.delete_exception(exception_id, db)

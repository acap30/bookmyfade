from fastapi import APIRouter, Depends
from db import schemas
from router_impl import db_wh_salon
from sqlalchemy.orm.session import Session
from db.database import get_db
from auth.oauth2 import get_current_user


router = APIRouter(
    prefix="/salon/working_hours",
    tags=["Salon Working Hours"]
)

@router.post("/")
def create_wh_salon(req: schemas.WorkingHoursSalonWeekCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_salon.create_wh_salon(req, db)


@router.put("/{salon_id}")
def update_wh_salon(salon_id: int, req: schemas.WorkingHoursWeekUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_wh_salon.update_working_hours_by_salon_id(salon_id, req, db)

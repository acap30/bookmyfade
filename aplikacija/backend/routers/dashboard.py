from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import schemas
from auth.oauth2 import get_current_user
from router_impl import db_dashboard


router = APIRouter(
    tags = ["Dashboard"],
    prefix = "/dashboard"
)

@router.get("/", response_model=schemas.DashboardStatistics)
def get_statistics(incomeMonth: int, incomeYear: int, appointmentMonth: int, appointmentYear: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    req = schemas.DashboardDates(incomeMonth=incomeMonth+1, incomeYear=incomeYear, appointmentMonth=appointmentMonth+1, appointmentYear=appointmentYear)
    return db_dashboard.get_statistics(req, db, current_user.id, current_user.role)
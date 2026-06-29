from datetime import date
from typing import List
from fastapi import APIRouter, Depends
from db import schemas
from sqlalchemy.orm.session import Session
from db.database import get_db
from auth.oauth2 import get_current_user
from router_impl import db_reservation

public_router = APIRouter(
    tags=["reservation public"],
    prefix="/public/reservation"
)

@public_router.get("/available/hairdresser/{hd_id}/{service_id}", response_model=schemas.Timeslots)
def get_available_timeslots(hd_id: int, service_id: int, date: date, db: Session = Depends(get_db)):
    return db_reservation.get_available_timeslots(hd_id, service_id, date, db)


router = APIRouter(
    tags=["reservation"],
    prefix="/reservation"
)

@router.post("/")
def create_reservation(req: schemas.ReservationCreate, db: Session = Depends(get_db)):
    return db_reservation.create_reservation(req, db)

@router.get("/", response_model = schemas.ReservationWrapper)
def get_all_reservations(
    client_name: str | None = None,
    hairdresser_id: int | None = None,
    salon_id: int | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    canceled: bool | None = None,
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserAuth = Depends(get_current_user)
):
    return db_reservation.get_reservations(db, skip, limit, current_user.id, 
            client_name, hairdresser_id, salon_id, date_from, date_to, canceled)
    
    # if current_user.role == schemas.Role.ADMIN:
    #     return db_reservation.get_all_reservations(db, skip, limit)
    # elif current_user.role == schemas.Role.OWNER:
    #     return db_reservation.get_all_reservations_by_owner_id(current_user.id, db, skip, limit)
    # else:
    #     return db_reservation.get_all_reservations_by_hairdresser_id(current_user.id, db, skip, limit)   

@router.get("/{reservation_id}", response_model = schemas.ReservationDisplay)
def get_reservation_by_id(reservation_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_reservation.get_reservation_by_id(reservation_id, db)
    elif current_user.role == schemas.Role.OWNER:
        return db_reservation.get_reservation_by_id_owner(current_user.id, reservation_id, db)
    else:
        return db_reservation.get_reservation_by_id_hd(current_user.id, reservation_id, db)

@router.put("/cancel/{reservation_id}")
def cancel_reservation(reservation_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_reservation.cancel_reservation(reservation_id, current_user.id, db)

@router.put("/{reservation_id}", response_model = schemas.ReservationDisplay)
def update_reservation(reservation_id: int, req: schemas.ReservationUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_reservation.update_reservation(reservation_id, req, db)
    elif current_user.role == schemas.Role.OWNER:
        return db_reservation.update_reservation_owner(current_user.id, reservation_id, req, db)
    else:
        return db_reservation.update_reservation_hd(current_user.id, reservation_id, req, db)
    

@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_reservation.delete_reservation(reservation_id, current_user.id, db)
    









from fastapi import HTTPException, status
from db import schemas
from sqlalchemy.orm.session import Session
from db.models import Hairdresser_Service, Reservations, Owner, Hairdresser, Salon
from datetime import datetime

def time_conflict(db: Session, hd_id: int, start_time: datetime, end_time: datetime):
    existing = (
    db.query(Reservations)
    .join(Hairdresser_Service)
    .filter(
        Hairdresser_Service.hairdresser_id == hd_id,
        Reservations.start_time < end_time,
        Reservations.end_time > start_time
    )
    .first()
)

    
    return existing

def create_reservation(req: schemas.ReservationCreate, db: Session):
    hs = db.query(Hairdresser_Service).filter(Hairdresser_Service.id == req.hs_id).first()
    if not hs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser/service not found")
    
    if(req.start_time > req.end_time):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                            detail="time not good")
    
    #TIME CHECK
    
    if time_conflict(db, hs.hairdresser_id, req.start_time, req.end_time):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="timeslot is full for this hairdresser")

    new_res = Reservations(
        hs_id = hs.id,
        client_name = req.client_name,
        client_phone = req.client_phone,
        start_time = req.start_time,
        end_time = req.end_time
    )

    db.add(new_res)
    db.commit()
    db.refresh(new_res)

    return new_res

def get_all_reservations(db: Session):
    reservations = db.query(Reservations).all()

    return reservations

def get_all_reservations_by_owner_id(user_id: int, db: Session):
    owner = db.query(Owner).filter(Owner.user_id == user_id).first()

    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="owner not found")
    
    res = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .join(Salon, Hairdresser.salon_id == Salon.id)
        .join(Owner, Owner.salon_id == Salon.id) 
        .filter(Owner.id == owner.id)
        .all()
    )


    return res

def get_all_reservations_by_hairdresser_id(user_id: int, db: Session):
    hd = db.query(Hairdresser).filter(Hairdresser.user_id == user_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser not found")
    
    res = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .filter(Hairdresser_Service.hairdresser_id == hd.id)
        .all()
    )


    return res

    


def get_reservation_by_id(res_id: int, db: Session):
    res = db.query(Reservations).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    return res

def update_reservation(res_id: int, req: schemas.ReservationUpdate, db: Session):
    res = db.query(Reservations).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    if req.hs_id is not None:
        hs = db.query(Reservations).filter(Reservations.hairdresser_service.id == req.hs_id)
        if not hs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser/service not found")
    

    start_time = req.start_time if req.start_time is not None else res.start_time
    end_time = req.end_time if req.end_time is not None else res.end_time

    if time_conflict(db, res.hairdresser_service.hairdresser_id, start_time, end_time):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="timeslot is full for this hairdresser")
    
    res.hs_id = req.hs_id if req.hs_id is not None else res.hs_id
    res.client_name = req.client_name if req.client_name is not None else res.client_name
    res.client_phone = req.client_phone if req.client_phone is not None else res.client_phone
    res.start_time = start_time
    res.end_time = end_time

    

    db.commit()
    db.refresh(res)

    return res

def delete_reservation(res_id: int, db: Session):

    res = db.query(Reservations).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    db.delete(res)
    db.commit()

    return {"message": "deleted"}
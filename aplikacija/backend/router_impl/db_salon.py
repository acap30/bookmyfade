from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import Salon, Owner
from router_impl import db_wh_salon
from db import schemas

def create_salon(db: Session, name: str, address: str, phone: str = None, email: str = None):
    salon = Salon(
        name=name,
        address=address,
        phone=phone,
        mail=email
    )
    db.add(salon)
    db.commit()
    db.refresh(salon)

    db_wh_salon.default_wh(salon.id, db)

    return salon

def get_salon_by_id(db: Session, salon_id: int):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )
    
    wh = db_wh_salon.get_wh_by_salon_id(salon_id, db)
    return schemas.SalonDisplay(
        id=salon_id,
        name=salon.name,
        address=salon.address,
        phone=salon.phone,
        email=salon.mail,
        wh=wh
    )

def get_all_salons(db: Session):
    salons = db.query(Salon).all()
    return salons
    

def update_salon(
    db: Session,
    salon_id: int,
    name: str = None,
    address: str = None,
    phone: str = None,
    email: str = None
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )
    if name is not None:
        salon.name = name
    if address is not None:
        salon.address = address
    if phone is not None:
        salon.phone = phone
    if email is not None:
        salon.mail = email

    db.commit()
    db.refresh(salon)

    return salon

def delete_salon(db: Session, salon_id: int):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )
    db.delete(salon)
    db.commit()

    return {"message": "Salon deleted"}

def get_my_salon(db: Session, user_id: int):
    salon = (
        db.query(Salon)
        .join(Salon.owners)
        .filter(Owner.user_id == user_id)
        .first()
    )

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )
    
    wh = db_wh_salon.get_wh_by_salon_id(salon.id, db)
    return schemas.SalonDisplay(
        id=salon.id,
        name=salon.name,
        address=salon.address,
        phone=salon.phone,
        email=salon.mail,
        wh=wh
    )
    
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import Salon

def create_salon(db: Session, name: str, address: str = None, phone: str = None):
    salon = Salon(
        name=name,
        address=address,
        phone=phone
    )
    db.add(salon)
    db.commit()
    db.refresh(salon)

    return salon

def get_salon_by_id(db: Session, salon_id: int):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )
    return salon

def get_all_salons(db: Session):
    return db.query(Salon).all()

def update_salon(
    db: Session,
    salon_id: int,
    name: str = None,
    address: str = None,
    phone: str = None
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
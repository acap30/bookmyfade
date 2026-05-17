from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import DbUser, Salon, Hairdresser

def create_hairdresser(
    db: Session,
    user_id: int,
    salon_id: int,
):
    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )

    existing = db.query(Hairdresser).filter(
        Hairdresser.user_id == user_id,
        Hairdresser.salon_id == salon_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hairdresser already exists for this user"
        )

    hairdresser = Hairdresser(
        user_id=user_id,
        salon_id=salon_id,
    )
    db.add(hairdresser)
    db.commit()
    db.refresh(hairdresser)

    return hairdresser

def get_hairdresser_by_id(db: Session, hairdresser_id: int):
    h = db.query(Hairdresser).filter(
        Hairdresser.id == hairdresser_id
    ).first()

    if not h:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hairdresser not found"
        )
    return h

def get_all_hairdressers(db: Session):
    return db.query(Hairdresser).all()

def update_hairdresser(
    db: Session,
    hairdresser_id: int,
    salon_id: int = None
):
    h = db.query(Hairdresser).filter(
        Hairdresser.id == hairdresser_id
    ).first()

    if not h:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hairdresser not found"
        )
    
    if salon_id:
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Salon not found"
            )
        h.salon_id = salon_id
    db.commit()
    db.refresh(h)

    return h

def delete_hairdresser(db: Session, hairdresser_id: int):
    h = db.query(Hairdresser).filter(
        Hairdresser.id == hairdresser_id
    ).first()

    if not h:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hairdresser not found"
        )
    db.delete(h)
    db.commit()

    return {"message": "Hairdresser deleted"}
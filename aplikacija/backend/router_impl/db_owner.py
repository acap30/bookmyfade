from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from db.models import DbUser, Owner, Salon
from db.schemas import Role, OwnerUpdate

def create_owner(db: Session, user_id: int, salon_id: int):
    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.role != Role.OWNER:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is not an owner"
        )

    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon not found"
        )

    existing_owner = db.query(Owner).filter(
        Owner.user_id == user_id,
        Owner.salon_id == salon_id
    ).first()
    if existing_owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner already exists for this user"
        )

    owner = Owner(
        user_id=user_id,
        salon_id=salon_id
    )

    db.add(owner)
    db.commit()
    db.refresh(owner)

    return owner

def get_owner_by_id(db: Session, owner_id: int):
    owner = db.query(Owner).filter(
        Owner.id == owner_id
    ).first()

    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner not found"
        )
    return owner

def get_all_owners(db: Session):
    return db.query(Owner).all()


def delete_owner(db: Session, owner_id: int):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()

    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner not found"
        )
    db.delete(owner)
    db.commit()

    return {"message": "Owner deleted"}
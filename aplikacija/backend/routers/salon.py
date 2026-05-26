from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
from db.database import get_db
from router_impl import db_salon as salon_impl
from db.schemas import SalonDisplay, SalonCreate, SalonUpdate

router_public = APIRouter(
    prefix="/public/salon",
    tags=["Public Salon"]
)

@router_public.get("/", response_model=list[SalonDisplay])
def get_public_salons(
    db: Session = Depends(get_db)
):
    return salon_impl.get_all_salons(db)


@router_public.get("/{salon_id}", response_model=SalonDisplay)
def get_public_salon_by_id(
    salon_id: int,
    db: Session = Depends(get_db)
):
    return salon_impl.get_salon_by_id(db, salon_id)

router = APIRouter(
    prefix="/salon",
    tags=["Salon"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/", response_model=SalonDisplay)
def create_salon(
    request: SalonCreate,
    db: Session = Depends(get_db)
):
    return salon_impl.create_salon(
        db,
        request.name,
        request.address,
        request.phone
    )

@router.get("/", response_model=list[SalonDisplay])
def get_all_salons(
    db: Session = Depends(get_db)
):
    return salon_impl.get_all_salons(db)

@router.get("/{salon_id}", response_model=SalonDisplay)
def get_salon_by_id(
    salon_id: int,
    db: Session = Depends(get_db)
):
    return salon_impl.get_salon_by_id(db, salon_id)

@router.put("/{salon_id}", response_model=SalonDisplay)
def update_salon(
    salon_id: int,
    request: SalonUpdate,
    db: Session = Depends(get_db)
):
    return salon_impl.update_salon(
        db,
        salon_id,
        request.name,
        request.address,
        request.phone
    )

@router.delete("/{salon_id}")
def delete_salon(
    salon_id: int,
    db: Session = Depends(get_db)
):
    return salon_impl.delete_salon(db, salon_id)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
from db.database import get_db
from router_impl import hairdresser as hairdresser_impl
from db.schemas import HairdresserDisplay, HairdresserCreate, HairdresserUpdate

router = APIRouter(
    prefix="/hairdresser",
    tags=["Hairdresser"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/", response_model=HairdresserDisplay)
def create_hairdresser(
    request: HairdresserCreate,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.create_hairdresser(
        db,
        request.user_id,
        request.salon_id
    )
    
@router.get("/{hairdresser_id}", response_model=HairdresserDisplay)
def get_hairdresser_by_id(
    hairdresser_id: int,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.get_hairdresser_by_id(
        db,
        hairdresser_id
    )

@router.get("/", response_model=list[HairdresserDisplay])
def get_all_hairdressers(
    db: Session = Depends(get_db)
):
    return hairdresser_impl.get_all_hairdressers(db)

@router.put("/{hairdresser_id}", response_model=HairdresserDisplay)
def update_hairdresser(
    hairdresser_id: int,
    request: HairdresserUpdate,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.update_hairdresser(
        db,
        hairdresser_id,
        request.salon_id
    )

@router.delete("/{hairdresser_id}")
def delete_hairdresser(
    hairdresser_id: int,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.delete_hairdresser(
        db,
        hairdresser_id
    )
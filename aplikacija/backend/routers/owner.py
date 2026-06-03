from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
from db.database import get_db
from router_impl import db_owner as owner_impl
from db.schemas import OwnerDisplay, OwnerCreate

router = APIRouter(
    prefix="/owner",
    tags=["Owner"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/", response_model=OwnerDisplay)
def create_owner(
    request: OwnerCreate,
    db: Session = Depends(get_db)
):
    return owner_impl.create_owner(
        db,
        request.user_id,
        request.salon_id
    )

@router.get("/{owner_id}", response_model=OwnerDisplay)
def get_owner_by_id(
    owner_id: int,
    db: Session = Depends(get_db)
):
    return owner_impl.get_owner_by_id(db, owner_id)

@router.get("/", response_model=list[OwnerDisplay])
def get_all_owners(
    db: Session = Depends(get_db)
):
    return owner_impl.get_all_owners(db)

@router.delete("/{owner_id}")
def delete_owner(
    owner_id: int,
    db: Session = Depends(get_db)
):
    return owner_impl.delete_owner(db, owner_id)


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
from db.database import get_db
from router_impl import db_hairdesser as hairdresser_impl
from db.schemas import HairdresserDisplay, HairdresserCreate, HairdresserUpdate, UserAuth, Role

router_public = APIRouter(
    prefix="/public/hairdresser",
    tags=["Public Hairdresser"]
)

@router_public.get("/", response_model=list[HairdresserDisplay])
def get_public_hairdressers(
    db: Session = Depends(get_db)
):
    return hairdresser_impl.get_all_hairdressers(db)


@router_public.get("/{hairdresser_id}", response_model=HairdresserDisplay)
def get_public_hairdresser_by_id(
    hairdresser_id: int,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.get_hairdresser_by_id(
        db,
        hairdresser_id
    )

router = APIRouter(
    prefix="/hairdresser",
    tags=["Hairdresser"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/", response_model=HairdresserDisplay)
def create_hairdresser(
    request: HairdresserCreate,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user)
):
    if current_user.role == Role.ADMIN:

        return hairdresser_impl.create_hairdresser(
            db,
            request.user_id,
            request.salon_id
        )
    
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")
    
@router.get("/{hairdresser_id}", response_model=HairdresserDisplay)
def get_hairdresser_by_id(
    hairdresser_id: int,
    db: Session = Depends(get_db)
):
    return hairdresser_impl.get_hairdresser_by_id(
        db,
        hairdresser_id
    )

@router.get("/")
def get_all_hairdressers(
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user)
):
    if current_user.role == Role.OWNER:
        return hairdresser_impl.get_my_hairdressers(db, current_user.id)
    else:
        return hairdresser_impl.get_all_hairdressers(db)
    

@router.get("/user/", response_model=HairdresserDisplay)    
def get_hairdresser_id_by_user_id(db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return hairdresser_impl.get_hairdresser_id_by_user_id(current_user.id, db)
    

@router.put("/{hairdresser_id}", response_model=HairdresserDisplay)
def update_hairdresser(
    hairdresser_id: int,
    request: HairdresserUpdate,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user)
):
    if current_user.role == Role.ADMIN:
        return hairdresser_impl.update_hairdresser(
            db,
            hairdresser_id,
            request.salon_id
        )

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")

@router.delete("/{hairdresser_id}")
def delete_hairdresser(
    hairdresser_id: int,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user)
):
    
    if current_user.role == Role.ADMIN:
        return hairdresser_impl.delete_hairdresser(
            db,
            hairdresser_id
        )

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")
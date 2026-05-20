from fastapi import APIRouter, Depends, HTTPException, status
from db.database import get_db
from sqlalchemy.orm.session import Session
from db import schemas
from router_impl import db_user
from auth.oauth2 import get_current_user

router = APIRouter(
    prefix = '/users',
    tags = ['users']
)

@router.post('/')
def create_user(request: schemas.User, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.create_user(db, request)

@router.get('/{user_id}')
def get_user_by_id(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.get_user_by_id(db, user_id)

@router.put('/{user_id}')
def update_user(request: schemas.UserUpdate, user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_user.update_user(db, user_id, request)
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="Unauthorized behavior")

@router.put('/update/')
def update_current_user(request: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.update_user(db, current_user.id, request)

@router.delete('/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_user.delete_user(db, user_id)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="Unauthorized behavior")
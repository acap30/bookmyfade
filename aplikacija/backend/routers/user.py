from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
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
    if current_user.role == schemas.Role.ADMIN or current_user.role == schemas.Role.OWNER:
        return db_user.create_user(db, request)
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")
    

@router.get('/', response_model = List[schemas.UserDisplay])
def get_all_users(db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_user.get_all_users(db)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")

@router.get('/{user_id}')
def get_user_by_id(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.get_user_by_id(db, user_id)

@router.put('/update/')
def update_current_user(request: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.update_user(db, current_user.id, request)

@router.put('/change-password/')
def change_password(request: schemas.UserPassword, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.update_password(db, current_user.id, request)

@router.put('/{user_id}')
def update_user(request: schemas.UserUpdate, user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_user.update_user(db, user_id, request)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")
    

@router.delete('/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    if current_user.role == schemas.Role.ADMIN:
        return db_user.delete_user(db, user_id)
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                             detail="Unauthorized behavior")

@router.patch("/upload-image")
async def upload_user_image(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_user.upload_picture(file, db, current_user.id)


from fastapi import APIRouter, Depends
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
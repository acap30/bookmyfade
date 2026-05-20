from fastapi import APIRouter, Depends
from db import schemas
from db.database import get_db
from sqlalchemy.orm.session import Session
from auth.oauth2 import get_current_user
from router_impl import db_service


router = APIRouter(
    prefix = '/service',
    tags = ['service']
)

@router.post('/')
def create_service(request: schemas.ServiceCreate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.create_service(db, request)

@router.get('/')
def get_all_services(db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.get_all_services(db)

@router.get('/{id}')
def get_service_by_id(id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.get_service_by_id(db, id)

@router.put('/{id}')
def update_service(id: int, request: schemas.ServiceUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.update_service(db, id, request)

@router.delete('/{id}')
def delete_service(id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.delete_service(db, id)
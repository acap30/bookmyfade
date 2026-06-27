from datetime import time, date

from fastapi import APIRouter, Depends
from db import schemas
from db.database import get_db
from sqlalchemy.orm.session import Session
from auth.oauth2 import get_current_user
from router_impl import db_service

public_router = APIRouter(
    prefix='/public/service',
    tags = ['Public Service']
)

@public_router.get('/salon/{salon_id}')
def get_public_services_by_salon_id(salon_id: int, db: Session = Depends(get_db)):
    return db_service.get_services_by_salon_id(salon_id, db)

@public_router.get('/timeslot', response_model=schemas.ServiceDisplay)
def get_services_for_timeslot(hd_id: int, res_date: date, start: time, db: Session = Depends(get_db)):
    return db_service.get_services_for_timeslot(hd_id, res_date, start, db)

@public_router.get('/hairdresser/{hairdresser_id}')
def get_public_services_by_hairdresser_id(hd_id: int, db: Session = Depends(get_db)):
    return db_service.get_services_by_hairdresser_id(hd_id, db)

router = APIRouter(
    prefix = '/service',
    tags = ['service']
)

# CRUD

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

#LINKER TABLE

@router.post('/link/{hairdresser_id}/{service_id}')
def link_service_to_hairdresser(hairdresser_id: int, service_id: int, req: schemas.ServiceLink, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.link_service_to_hairdresser(hairdresser_id, service_id, req, db)

@router.post('/{hairdresser_id}')
def create_service_with_hairdresser(hairdresser_id: int, req: schemas.ServiceCreateAndLink, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.create_service_with_hairdresser(hairdresser_id, req, db)

@router.put('/link/{hairdresser_id}/{service_id}')
def update_service_to_hairdresser(hairdresser_id: int, service_id: int, req: schemas.ServiceLinkUpdate, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.update_link(hairdresser_id, service_id, req, db)

@router.delete('/link/{hairdresser_id}/{service_id}')
def unlink_service_to_hairdresser(hairdresser_id: int, service_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.unlink_service_to_hairdresser(hairdresser_id, service_id, db)

#GET ALL LINKS TO A SERVICE

@router.get('/link/service/{service_id}')
def get_all_links_by_service_id(service_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.get_all_links_by_service_id(service_id, db)
#ADD SINGLE LINK (ne znam sta sam hteo ovime)

#GET ALL SERVICES BY SALON ID

@router.get('/salon/{salon_id}')
def get_services_by_salon_id(salon_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.get_services_by_salon_id(salon_id, db)

#GET ALL SERVICES BY HAIRDRESSER ID

@router.get('/hairdresser/{hairdresser_id}')
def get_services_by_hairdresser_id(hd_id: int, db: Session = Depends(get_db), current_user: schemas.UserAuth = Depends(get_current_user)):
    return db_service.get_services_by_hairdresser_id(hd_id, db)


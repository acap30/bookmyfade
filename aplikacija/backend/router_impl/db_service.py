from fastapi import HTTPException, status
from sqlalchemy.orm.session import Session
from db import schemas
from db.models import Service, Hairdresser, Hairdresser_Service

def create_service(db: Session, request: schemas.ServiceCreate):
    new_service = Service(
        name=request.name,
        length_minutes=request.length
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return {"message": "Service added"}

def get_all_services(db: Session):
    return db.query(Service).all()

def get_service_by_id(db: Session, id: int):
    service = db.query(Service).filter(Service.id == id).first()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found")
    
    return service

def update_service(db: Session, id: int, request: schemas.ServiceCreate):
    service = db.query(Service).filter(Service.id == id).first()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found")
    
    service.name = request.name if request.name is not None else service.name
    service.length = request.length if request.length is not None else service.length_minutes

    db.commit()
    db.refresh(service)

    return {"message": "Service updated successfully"}

def delete_service(db: Session, id: int):
    service = db.query(Service).filter(Service.id == id).first()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found")
    
    db.delete(service)
    db.commit()

    return {"message": "Service deleted successfully"}

def link_service_to_hairdresser(hd_id: int, svc_id: int, req: schemas.ServiceLink, db: Session):

    hd = db.query(Hairdresser).filter(hd_id == Hairdresser.id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    svc = db.query(Service).filter(svc_id==Service.id).first()

    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found.")
    
    new_link = Hairdresser_Service(
        hairdresser_id = hd_id,
        service_id = svc_id,
        price = req.price
    )

    db.add(new_link)
    db.commit()
    db.refresh(new_link)

    return {"message": "Good."}

def create_service_with_hairdresser(hd_id: int, req: schemas.ServiceCreateAndLink, db: Session):
    
    hd = db.query(Hairdresser).filter(hd_id == Hairdresser.id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    new_service = Service(
        name = req.name,
        length_minutes = req.length
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    new_link = Hairdresser_Service(
        hairdresser_id = hd_id,
        service_id = new_service.id,
        price = req.price
    )

    db.add(new_link)
    db.commit()
    db.refresh(new_link)

    return {"message": "good"}

from fastapi import HTTPException, status
from sqlalchemy.orm.session import Session
from db import schemas
from db.models import Service, Hairdresser, Hairdresser_Service, Salon

def create_service(db: Session, request: schemas.ServiceCreate):
    
    salon = db.query(Salon).filter(Salon.id == request.salon_id).first()

    if not salon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Salon not found")
    
    new_service = Service(
        salon_id = salon.id,
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

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    
    svc = db.query(Service).filter(Service.id == svc_id).first()

    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found.")
    
    if hd.salon_id != svc.salon_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="service/barber not in the same salon")
    
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
    
    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    salon = db.query(Salon).filter(Salon.id == req.salon_id).first()

    if not salon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Salon not found")
    new_service = Service(
        salon_id = salon.id,
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

def get_services_by_salon_id(salon_id: int, db: Session):

    salon = db.query(Salon).filter(Salon.id == salon_id).first()

    if not salon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Salon not found")

    services = db.query(Service).filter(Service.salon_id == salon_id).all()

    return {
        "salon_id": salon.id,
        "services": [
            {
                "id": service.id,
                "name": service.name,
                "length": service.length_minutes
            }
            for service in services
        ]
    }


def get_services_by_hairdresser_id(hd_id: int, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")

    services = db.query(Hairdresser_Service).filter(Hairdresser_Service.hairdresser_id==hd_id).all()

    return {
        "salon_id": hd.salon_id,
        "hairdresser_id": hd.id,
        "services": [
            {
            "id": ser.service.id,
            "name": ser.service.name,
            "length": ser.service.length_minutes,
            "price": ser.price
            }
            for ser in services
        ]
    }

def unlink_service_to_hairdresser(hd_id: int, svc_id: id, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    
    svc = db.query(Service).filter(Service.id == svc_id).first()

    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found.")
    
    to_delete = db.query(Hairdresser_Service).filter(Hairdresser_Service.hairdresser_id == hd_id,
                                                      Hairdresser_Service.service_id == svc_id).first()
    
    if not to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="link not found")
    
    db.delete(to_delete)
    db.commit()

    return {"message": "good"}

def update_link(hd_id: int, svc_id: int, req: schemas.ServiceLinkUpdate, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser not found.")
    
    
    svc = db.query(Service).filter(Service.id == svc_id).first()

    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found.")
    
    link = db.query(Hairdresser_Service).filter(Hairdresser_Service.hairdresser_id == hd_id,
                                                      Hairdresser_Service.service_id == svc_id).first()
    
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="link not found")
    
    link.price = req.price if req.price is not None else link.price

    db.commit()
    db.refresh(link)

    return link


def get_all_links_by_service_id(svc_id: int, db: Session):


    svc = db.query(Service).filter(Service.id == svc_id).first()

    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Service not found.")
    
    links = db.query(Hairdresser_Service).filter(Hairdresser_Service.service_id == svc_id).all()

    return {
        "service_id": svc.id,
        "name": svc.name,
        "salon_id": svc.salon_id,
        "length": svc.length_minutes,
        "links": [
            {
                "hairdresser_id": link.hairdresser_id,
                "price": link.price
            }
            for link in links
        ]
    }
    
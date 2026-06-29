from fastapi import HTTPException, status
from db import schemas
from sqlalchemy.orm.session import Session
from sqlalchemy.orm import joinedload
from db.models import Hairdresser_Service, Reservations, DbUser, Owner, Hairdresser, Service, Salon, WorkingHours, WorkingHoursExceptions
from datetime import date, datetime, timedelta, time

def get_hours(res_date: date, db: Session, hd_id: int):
    weekday_str = res_date.strftime("%A").lower()
    
    wh_main = (
        db.query(WorkingHours)
        .filter(WorkingHours.hairdresser_id==hd_id,
                WorkingHours.weekday==schemas.Weekday(weekday_str))
        .first()
    )

    wh_exception = (
        db.query(WorkingHoursExceptions)
        .filter(WorkingHoursExceptions.date==res_date,
                WorkingHoursExceptions.hairdresser_id==hd_id)
        .first()
    )
    
    start = None
    end = None
    if wh_exception is not None and wh_exception.day_off is False:
        start = wh_exception.start
        end = wh_exception.end
    elif wh_main is not None and wh_main.off is False:
        start = wh_main.start
        end = wh_main.end
    else:
        start = time.min
        end = start

    return start, end

def time_conflict(db: Session, hd_id: int, date: date, start_time: time, end_time: time):

    start, end = get_hours(date, db, hd_id)

    
    existing = (
    db.query(Reservations)
    .join(Hairdresser_Service)
    .filter(
        Hairdresser_Service.hairdresser_id == hd_id,
        Reservations.date == date,
        Reservations.start_time < end_time,
        Reservations.end_time > start_time,
        Reservations.canceled == False
    )
    .first()
    )

    
    
    return existing or end_time > end


def create_reservation(req: schemas.ReservationCreate, db: Session):
    hs = db.query(Hairdresser_Service).options(joinedload(Hairdresser_Service.service)).filter(Hairdresser_Service.id == req.hs_id).first()
    if not hs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Hairdresser/service not found")
    
    end_time = (
        datetime.combine(datetime.today(), req.start_time)
        + timedelta(minutes=hs.service.length_minutes)
    ).time()
    print(end_time)

    #TIME CHECK
    if time_conflict(db, hs.hairdresser_id, req.res_date, req.start_time, end_time):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="timeslot is full for this hairdresser")

    

    new_res = Reservations(
        hs_id = hs.id,
        client_name = req.client_name,
        client_phone = req.client_phone,
        date = req.res_date,
        start_time = req.start_time,
        end_time = end_time
    )

    db.add(new_res)
    db.commit()
    db.refresh(new_res)

    return new_res

        

def get_reservations(db: Session, skip: int, limit: int, user_id: int,
        client_name: str | None, hairdresser_id: int | None, salon_id: int | None, 
        date_from: date | None, date_to: date | None, canceled: bool | None):
    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")
    
    
    if user.role == schemas.Role.ADMIN:
        query = get_all_reservations(db)
    elif user.role == schemas.Role.OWNER:
        query = get_all_reservations_by_owner_id(user_id, db)
    else:
        query = get_all_reservations_by_hairdresser_id(user_id, db)
    

    if client_name:
        query = query.filter(
            Reservations.client_name.ilike(f"%{client_name}%")
        )

    if hairdresser_id:
        query = query.filter(
            Hairdresser_Service.hairdresser_id == hairdresser_id
        )

    if salon_id:
        query = query.filter(
            Hairdresser.salon_id == salon_id
        )

    if date_from:
        query = query.filter(
            Reservations.date >= date_from
        )
    if date_to:
        query = query.filter(
            Reservations.date <= date_to
        )

    if canceled is not None:
        query = query.filter(
            Reservations.canceled == canceled
        )

    total = query.count()

    reservations = (
        query
        .order_by(Reservations.canceled.asc(), Reservations.date, Reservations.start_time)
        .offset(skip)
        .limit(limit)
        .all()
    )

    data = []
    for r in reservations:
        data.append({
            "id": r.id,
            "client_name": r.client_name,
            "client_phone": r.client_phone,
            "res_date": r.date,
            "start_time": r.start_time,
            "end_time": r.end_time,
            "canceled": r.canceled,
            "hairdresser": {
                "id": r.hairdresser_service.hairdresser.id,
                "user_id": r.hairdresser_service.hairdresser.user.id,
                "first_name": r.hairdresser_service.hairdresser.user.first_name,
                "last_name": r.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": r.hairdresser_service.service.id,
                "name": r.hairdresser_service.service.name,
                "length_minutes": r.hairdresser_service.service.length_minutes
            }
        })

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data
    }

def get_all_reservations(db: Session):
    reservations = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        )
    )
    return reservations

    

def get_all_reservations_by_owner_id(user_id: int, db: Session):
    owner = db.query(Owner).filter(Owner.user_id == user_id).first()

    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="owner not found")
    
    query = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .join(Salon, Hairdresser.salon_id == Salon.id)
        .join(Owner, Owner.salon_id == Salon.id)
        .options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ) 
        .filter(Owner.id == owner.id)
    )

    return query

    


    

def get_all_reservations_by_hairdresser_id(user_id: int, db: Session):
    hd = db.query(Hairdresser).filter(Hairdresser.user_id == user_id).first()

    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser not found")
    
    query = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ) 
        .filter(Hairdresser_Service.hairdresser_id == hd.id)
    )

    return query
    


def get_reservation_by_id(res_id: int, db: Session):

    res = (
        db.query(Reservations)
        .options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        )
        .filter(Reservations.id == res_id)
        .first()
    )

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data

def get_reservation_by_id_owner(user_id: int, res_id: int, db: Session):

    owner = db.query(Owner).filter(Owner.user_id == user_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    
    res = db.query(Reservations).options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ).filter(Reservations.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    
    authorized = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .join(Salon, Hairdresser.salon_id == Salon.id)
        .join(Owner, Salon.id == Owner.salon_id)
        .filter(Reservations.id == res.id, Owner.id == owner.id)
        .first()
    )

    if not authorized:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data



def get_reservation_by_id_hd(user_id: int, res_id: int, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.user_id == user_id).first()
    if not hd:
        raise HTTPException(status_code=404, detail="Hairdresser not found")

    
    res = db.query(Reservations).options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ).filter(Reservations.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    
    authorized = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .filter(Reservations.id == res.id, Hairdresser.id == hd.id)
        .first()
    )

    if not authorized:
        raise HTTPException(status_code=404, detail="Reservation not found")

    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data




def update_reservation(res_id: int, req: schemas.ReservationUpdate, db: Session):

    
    res = db.query(Reservations).options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ).filter(Reservations.id == res_id).first()



    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    if req.hs_id is not None:
        hs = db.query(Reservations).filter(Reservations.hairdresser_service.id == req.hs_id)
        if not hs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser/service not found")
        
    

    start_time = req.start_time if req.start_time is not None else res.start_time
    end_time = req.end_time if req.end_time is not None else res.end_time

    if (start_time != res.start_time or end_time != res.end_time):
        if time_conflict(db, res.hairdresser_service.hairdresser_id, res.date, start_time, end_time):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail="timeslot is full for this hairdresser")
    
    res.hs_id = req.hs_id if req.hs_id is not None else res.hs_id
    res.client_name = req.client_name if req.client_name is not None else res.client_name
    res.client_phone = req.client_phone if req.client_phone is not None else res.client_phone
    res.start_time = start_time
    res.end_time = end_time

    

    db.commit()
    db.refresh(res)

    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data


def update_reservation_owner(user_id: int, res_id: int, req: schemas.ReservationUpdate, db: Session):

    owner = db.query(Owner).filter(Owner.user_id == user_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    res = db.query(Reservations).options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    if req.hs_id is not None:
        hs = db.query(Reservations).filter(Reservations.hairdresser_service.id == req.hs_id)
        if not hs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser/service not found")
        
    authorized = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .join(Salon, Hairdresser.salon_id == Salon.id)
        .join(Owner, Salon.id == Owner.salon_id)
        .filter(Reservations.id == res.id, Owner.id == owner.id)
        .first()
    )

    if not authorized:
        raise HTTPException(status_code=404, detail="Reservation not found")
    

    start_time = req.start_time if req.start_time is not None else res.start_time
    end_time = req.end_time if req.end_time is not None else res.end_time

    if (start_time != res.start_time or end_time != res.end_time):
        if time_conflict(db, res.hairdresser_service.hairdresser_id, res.date, start_time, end_time):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail="timeslot is full for this hairdresser")
    
    res.hs_id = req.hs_id if req.hs_id is not None else res.hs_id
    res.client_name = req.client_name if req.client_name is not None else res.client_name
    res.client_phone = req.client_phone if req.client_phone is not None else res.client_phone
    res.start_time = start_time
    res.end_time = end_time

    

    db.commit()
    db.refresh(res)

    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data

def update_reservation_hd(user_id: int, res_id: int, req: schemas.ReservationUpdate, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.user_id == user_id).first()
    if not hd:
        raise HTTPException(status_code=404, detail="Hairdresser not found")

    res = db.query(Reservations).options(
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.hairdresser)
            .joinedload(Hairdresser.user),
            joinedload(Reservations.hairdresser_service)
            .joinedload(Hairdresser_Service.service),
        ).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    if req.hs_id is not None:
        hs = db.query(Reservations).filter(Reservations.hairdresser_service.id == req.hs_id)
        if not hs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser/service not found")
        

    authorized = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .filter(Reservations.id == res.id, Hairdresser.id == hd.id)
        .first()
    )    
    
    if not authorized:
        raise HTTPException(status_code=404, detail="Reservation not found")

    start_time = req.start_time if req.start_time is not None else res.start_time
    end_time = req.end_time if req.end_time is not None else res.end_time

    if (start_time != res.start_time or end_time != res.end_time):
        if time_conflict(db, res.hairdresser_service.hairdresser_id, res.date, start_time, end_time):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail="timeslot is full for this hairdresser")
    
    res.hs_id = req.hs_id if req.hs_id is not None else res.hs_id
    res.client_name = req.client_name if req.client_name is not None else res.client_name
    res.client_phone = req.client_phone if req.client_phone is not None else res.client_phone
    res.start_time = start_time
    res.end_time = end_time

    

    db.commit()
    db.refresh(res)

    data = {
            "id": res.id,
            "client_name": res.client_name,
            "client_phone": res.client_phone,
            "res_date": res.date,
            "start_time": res.start_time,
            "end_time": res.end_time,
            "canceled": res.canceled,
            "hairdresser": {
                "id": res.hairdresser_service.hairdresser.id,
                "user_id": res.hairdresser_service.hairdresser.user.id,
                "first_name": res.hairdresser_service.hairdresser.user.first_name,
                "last_name": res.hairdresser_service.hairdresser.user.last_name
            },
            "service": {
                "id": res.hairdresser_service.service.id,
                "name": res.hairdresser_service.service.name,
                "length_minutes": res.hairdresser_service.service.length_minutes
            }
        }
    
    return data

def check_authorized(res_id: int, user_id: int, db: Session):
    user_role = db.query(DbUser.role).filter(DbUser.id == user_id).first()

    if not user_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="user not found")
    
    if user_role == schemas.Role.OWNER:

        owner = db.query(Owner).filter(Owner.user_id == user_id).first()
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        authorized = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
        .join(Salon, Hairdresser.salon_id == Salon.id)
        .join(Owner, Salon.id == Owner.salon_id)
        .filter(Reservations.id == res_id, Owner.id == owner.id)
        .first()
        )

        if not authorized:
            raise HTTPException(status_code=404, detail="Reservation not found")
        
    
    elif user_role == schemas.Role.HAIRSTYLIST:

        hd = db.query(Hairdresser).filter(Hairdresser.user_id == user_id).first()
        if not hd:
            raise HTTPException(status_code=404, detail="Hairdresser not found")
    
        authorized = (
            db.query(Reservations)
            .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
            .join(Hairdresser, Hairdresser_Service.hairdresser_id == Hairdresser.id)
            .filter(Reservations.id == res_id, Hairdresser.id == hd.id)
            .first()
        )    
        
        if not authorized:
            raise HTTPException(status_code=404, detail="Reservation not found")
       
    return True


def cancel_reservation(res_id: int, user_id: int, db: Session):

    res = db.query(Reservations).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    check_authorized(res_id, user_id, db)
        
    res.canceled = True
    db.commit()
    db.refresh(res)

    return {"message": "good"}
    

def delete_reservation(res_id: int, user_id: int, db: Session):

    res = db.query(Reservations).filter(Reservations.id == res_id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reservation not found")
    
    check_authorized(res_id, user_id,  db)
    
    db.delete(res)
    db.commit()

    return {"message": "deleted"}


def generate_slots(hd_id, start, end, db, interval=30):
    slots = []
    current = start
    while current < end:
        if time_conflict(db, hd_id, current.date(), current.time(), (current + timedelta(minutes=interval)).time()):
            print("Conflict")
        else:
            slots.append(current.time())
        current += timedelta(minutes=30)
    return slots



def get_available_timeslots_by_hairdresser(hd_id: int, res_date: date, db: Session):
    
    start, end = get_hours(res_date, db, hd_id)
    
    start_dt = datetime.combine(res_date, start)
    end_dt = datetime.combine(res_date, end)
    slots = generate_slots(hd_id, start_dt, end_dt, db)

    return schemas.Timeslots(
        hairdresser_id=hd_id,
        res_date=res_date,
        service_id=None,
        slots=slots
    )

def get_available_timeslots_by_hairdresser_and_service(hd_id: int, service_id: int, res_date: date, db: Session):

    hs = (
        db.query(Hairdresser_Service)
        .options(joinedload(Hairdresser_Service.service))
        .filter(Hairdresser_Service.hairdresser_id==hd_id,
                Hairdresser_Service.service_id==service_id)
        .first()
    )

    if not hs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wrong service")

    start, end = get_hours(res_date, db, hd_id)

    start_dt = datetime.combine(res_date, start)
    end_dt = datetime.combine(res_date, end)
    slots = generate_slots(hd_id, start_dt, end_dt, db, interval=hs.service.length_minutes)

    return schemas.Timeslots(
        hairdresser_id=hd_id,
        res_date=res_date,
        service_id=service_id,
        slots=slots
    )

def get_available_timeslots(hd_id: int, service_id: int, res_date: date, db: Session):

    hd = db.query(Hairdresser).filter(Hairdresser.id == hd_id).first()
    if not hd:
        raise HTTPException(status_code=404, detail="Hairdresser not found")
    
    
    if res_date < date.today():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="invalid date")

    if service_id == 0:        
        return get_available_timeslots_by_hairdresser(hd_id, res_date, db)
    else:

        service = db.query(Service).filter(Service.id == service_id).first()

        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return get_available_timeslots_by_hairdresser_and_service(hd_id, service_id, res_date, db)
    

    

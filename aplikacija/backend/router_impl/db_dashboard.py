from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from db import schemas
from db.models import Hairdresser, Owner, Reservations, Hairdresser_Service
from datetime import date, timedelta

def get_statistics(db: Session, user_id: int, role: schemas.Role):

    today = date.today()
    start = today.replace(day=1)

    if today.month == 12:
        end = date(today.year + 1, 1, 1)
    else:
        end = date(today.year, today.month + 1, 1)

    activeBarbers = (
        db.query(Hairdresser)
        .filter(Hairdresser.is_active == True)
        .count()
    )

    todayAppointments = (
        db.query(Reservations)
        .filter(Reservations.date == today)
        .count()
    )

    from sqlalchemy import func

    month_stats = (
        db.query(
            func.count(Reservations.id),
            func.coalesce(func.sum(Hairdresser_Service.price), 0)
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start,
            Reservations.date < end
        )
        .first()
    )

    monthAppointments = month_stats[0]
    monthlyRevenue = month_stats[1]

    
    income_rows = (
        db.query(
            Reservations.date.label("date"),
            func.coalesce(func.sum(Hairdresser_Service.price), 0).label("income")
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start,
            Reservations.date < end
        )
        .group_by(Reservations.date)
        .all()
    )

    appointment_rows = (
        db.query(
            Reservations.date.label("date"),
            func.count(Reservations.id).label("appointments")
        )
        .filter(
            Reservations.date >= start,
            Reservations.date < end
        )
        .group_by(Reservations.date)
        .all()
    )

    incomeData = fill_month(start, end, income_rows, "income")
    appointmentData = fill_month(start, end, appointment_rows, "appointments")

    
    return schemas.DashboardStatistics(
        todayAppointments=todayAppointments,
        monthlyRevenue=monthlyRevenue,
        activeBarbers=activeBarbers,
        monthAppointments=monthAppointments,
        incomeData=incomeData,
        appointmentData=appointmentData
    )

def get_all_stats(db: Session):
    return db.query(Hairdresser).all()

def get_stats_owner(db: Session, user_id: int):
    owner = db.query(Owner).filter(Owner.user_id==user_id).first()
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="owner not found")

    return db.query(Hairdresser).filter(Hairdresser.salon_id==owner.salon_id).all()

def get_stats_hd(db: Session, user_id):
    hd = db.query(Hairdresser).filter(Hairdresser.user_id==user_id).first()
    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser not found")
    
    return hd



def fill_month(start, end, rows, value_key):
    data_map = {r.date: getattr(r, value_key) for r in rows}

    result = []
    current = start

    while current < end:
        result.append({
            "date": current,
            value_key: data_map.get(current, 0)
        })
        current += timedelta(days=1)

    return result
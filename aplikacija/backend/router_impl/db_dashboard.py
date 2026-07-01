from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from db import schemas
from db.models import Hairdresser, Owner, Reservations, Hairdresser_Service, DbUser, Salon
from datetime import date, timedelta


def get_statistics(req: schemas.DashboardDates, db: Session, user_id: int, role: schemas.Role):

    if req.appointmentMonth > 12 or req.appointmentMonth < 1 or req.incomeMonth > 12 or req.incomeMonth < 1:
        raise HTTPException(status_code=400, detail="bad month")
    
    if role == schemas.Role.ADMIN:
        return get_statistics_admin(req, db)
    elif role == schemas.Role.OWNER:
        return get_statistics_owner(req, db, user_id)
    else:
        return get_statistics_hd(req, db, user_id)
    
    
def get_statistics_admin(req: schemas.DashboardDates, db: Session):

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


    start_inc = date(req.incomeYear, req.incomeMonth, 1)
    if start_inc.month == 12:
        end_inc = date(start_inc.year + 1, 1, 1)
    else:
        end_inc = date(start_inc.year, start_inc.month + 1, 1)
    income_rows = (
        db.query(
            Reservations.date.label("date"),
            func.coalesce(func.sum(Hairdresser_Service.price), 0).label("income")
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start_inc,
            Reservations.date < end_inc
        )
        .group_by(Reservations.date)
        .all()
    )

    start_app = date(req.appointmentYear, req.appointmentMonth, 1)
    if start_app.month == 12:
        end_app = date(start_app.year + 1, 1, 1)
    else:
        end_app = date(start_app.year, start_app.month + 1, 1)
    appointment_rows = (
        db.query(
            Reservations.date.label("date"),
            func.count(Reservations.id).label("appointments")
        )
        .filter(
            Reservations.date >= start_app,
            Reservations.date < end_app
        )
        .group_by(Reservations.date)
        .all()
    )

    incomeData = fill_month(start_inc, end_inc, income_rows, "income")
    appointmentData = fill_month(start_app, end_app, appointment_rows, "appointments")

    
    return schemas.DashboardStatistics(
        todayAppointments=todayAppointments,
        monthlyRevenue=monthlyRevenue,
        activeBarbers=activeBarbers,
        monthAppointments=monthAppointments,
        incomeData=incomeData,
        appointmentData=appointmentData
    )


def get_statistics_owner(req: schemas.DashboardDates, db: Session, user_id: int):


    owner = db.query(Owner).filter(Owner.user_id==user_id).first()
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="owner not found")
    
    
    today = date.today()
    start = today.replace(day=1)

    if today.month == 12:
        end = date(today.year + 1, 1, 1)
    else:
        end = date(today.year, today.month + 1, 1)

    activeBarbers = (
        db.query(Hairdresser)
        .filter(Hairdresser.is_active == True,
                Hairdresser.salon_id==owner.salon_id)
        .count()
    )

    todayAppointments = (
        db.query(Reservations)
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser.id == Hairdresser_Service.hairdresser_id)
        .filter(Reservations.date == today,
                Hairdresser.salon_id == owner.salon_id)
        .count()
    )


    month_stats = (
        db.query(
            func.count(Reservations.id),
            func.coalesce(func.sum(Hairdresser_Service.price), 0)
        )
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser.id == Hairdresser_Service.hairdresser_id)
        .filter(
            Reservations.date >= start,
            Reservations.date < end,
            Hairdresser.salon_id == owner.salon_id
        )
        .first()
    )

    monthAppointments = month_stats[0]
    monthlyRevenue = month_stats[1]

    start_inc = date(req.incomeYear, req.incomeMonth, 1)
    if start_inc.month == 12:
        end_inc = date(start_inc.year + 1, 1, 1)
    else:
        end_inc = date(start_inc.year, start_inc.month + 1, 1)
    income_rows = (
        db.query(
            Reservations.date.label("date"),
            func.coalesce(func.sum(Hairdresser_Service.price), 0).label("income")
        )
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser.id == Hairdresser_Service.hairdresser_id)
        .filter(
            Reservations.date >= start_inc,
            Reservations.date < end_inc,
            Hairdresser.salon_id == owner.salon_id
        )
        .group_by(Reservations.date)
        .all()
    )
    start_app = date(req.appointmentYear, req.appointmentMonth, 1)
    if start_app.month == 12:
        end_app = date(start_app.year + 1, 1, 1)
    else:
        end_app = date(start_app.year, start_app.month + 1, 1)
    appointment_rows = (
        db.query(
            Reservations.date.label("date"),
            func.count(Reservations.id).label("appointments")
        )
        .join(Hairdresser_Service, Reservations.hs_id == Hairdresser_Service.id)
        .join(Hairdresser, Hairdresser.id == Hairdresser_Service.hairdresser_id)
        .filter(
            Reservations.date >= start_app,
            Reservations.date < end_app,
            Hairdresser.salon_id == owner.salon_id
        )
        .group_by(Reservations.date)
        .all()
    )

    incomeData = fill_month(start_inc, end_inc, income_rows, "income")
    appointmentData = fill_month(start_app, end_app, appointment_rows, "appointments")

    
    return schemas.DashboardStatistics(
        todayAppointments=todayAppointments,
        monthlyRevenue=monthlyRevenue,
        activeBarbers=activeBarbers,
        monthAppointments=monthAppointments,
        incomeData=incomeData,
        appointmentData=appointmentData
    )

def get_statistics_hd(req: schemas.DashboardDates, db: Session, user_id: int):


    hd = db.query(Hairdresser).filter(Hairdresser.user_id==user_id).first()
    if not hd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="hairdresser not found")
    
    
    today = date.today()
    start = today.replace(day=1)

    if today.month == 12:
        end = date(today.year + 1, 1, 1)
    else:
        end = date(today.year, today.month + 1, 1)

    activeBarbers = (
        db.query(Hairdresser)
        .filter(Hairdresser.is_active == True,
                Hairdresser.id == hd.id)
        .count()
    )

    todayAppointments = (
        db.query(Reservations)
        .join(Hairdresser_Service)
        .filter(Reservations.date == today,
                Hairdresser_Service.hairdresser_id == hd.id)
        .count()
    )


    month_stats = (
        db.query(
            func.count(Reservations.id),
            func.coalesce(func.sum(Hairdresser_Service.price), 0)
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start,
            Reservations.date < end,
            Hairdresser_Service.hairdresser_id == hd.id
        )
        .first()
    )

    monthAppointments = month_stats[0]
    monthlyRevenue = month_stats[1]

    start_inc = date(req.incomeYear, req.incomeMonth, 1)
    if start_inc.month == 12:
        end_inc = date(start_inc.year + 1, 1, 1)
    else:
        end_inc = date(start_inc.year, start_inc.month + 1, 1)
    income_rows = (
        db.query(
            Reservations.date.label("date"),
            func.coalesce(func.sum(Hairdresser_Service.price), 0).label("income")
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start_inc,
            Reservations.date < end_inc,
            Hairdresser_Service.hairdresser_id == hd.id
        )
        .group_by(Reservations.date)
        .all()
    )
    start_app = date(req.appointmentYear, req.appointmentMonth, 1)
    if start_app.month == 12:
        end_app = date(start_app.year + 1, 1, 1)
    else:
        end_app = date(start_app.year, start_app.month + 1, 1)
    appointment_rows = (
        db.query(
            Reservations.date.label("date"),
            func.count(Reservations.id).label("appointments")
        )
        .join(Hairdresser_Service)
        .filter(
            Reservations.date >= start_app,
            Reservations.date < end_app,
            Hairdresser_Service.hairdresser_id == hd.id
        )
        .group_by(Reservations.date)
        .all()
    )

    incomeData = fill_month(start_inc, end_inc, income_rows, "income")
    appointmentData = fill_month(start_app, end_app, appointment_rows, "appointments")

    
    return schemas.DashboardStatistics(
        todayAppointments=todayAppointments,
        monthlyRevenue=monthlyRevenue,
        activeBarbers=activeBarbers,
        monthAppointments=monthAppointments,
        incomeData=incomeData,
        appointmentData=appointmentData
    )


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
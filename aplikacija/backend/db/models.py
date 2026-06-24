from sqlalchemy import Column, Enum, Integer, String, ForeignKey, Float, Time, Date, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from db.schemas import Role, Weekday

Base = declarative_base()

class DbUser(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=True)
    role = Column(Enum(Role), nullable=False)
    
    owners = relationship(
        "Owner",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    hairdressers = relationship(
        "Hairdresser",
        back_populates="user",
        cascade="all, delete-orphan"
    )

class Owner(Base):
    __tablename__ = "Vlasnici"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable = False)
    salon_id = Column(Integer, ForeignKey("Saloni.id"), nullable=False)
    user = relationship("DbUser", back_populates="owners")
    salon = relationship("Salon", back_populates="owners")

class Salon(Base):
    __tablename__ = "Saloni"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    mail = Column(String(255), nullable=True)
    owners = relationship("Owner", back_populates="salon")
    hairdressers = relationship("Hairdresser", back_populates="salon")
    services = relationship("Service", back_populates="salon")
    working_hours_salon = relationship("WorkingHoursSalon", back_populates="salon")

class Hairdresser(Base):
    __tablename__ = "Frizeri"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable = False)
    salon_id = Column(Integer, ForeignKey("Saloni.id"), nullable=False)
    user = relationship("DbUser", back_populates="hairdressers")
    salon = relationship("Salon", back_populates="hairdressers")

    services = relationship("Hairdresser_Service", back_populates="hairdresser", cascade="all, delete-orphan")
    working_hours = relationship("WorkingHours", back_populates="hairdresser", cascade="all, delete-orphan")
    working_hours_exceptions = relationship("WorkingHoursExceptions", back_populates="hairdresser", cascade="all, delete-orphan")

class Service(Base):
    __tablename__ = "Usluge"

    id = Column(Integer, primary_key=True)
    salon_id = Column(Integer, ForeignKey("Saloni.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    length_minutes = Column(Integer, nullable=False)

    salon = relationship(
        "Salon",
        back_populates="services"
    )

    hairdressers = relationship(
        "Hairdresser_Service",
        back_populates="service",
        cascade="all, delete-orphan"
    )
    

class Hairdresser_Service(Base):
    __tablename__ = "Usluge_po_frizeru"

    id = Column(Integer, primary_key=True)
    hairdresser_id = Column(Integer, ForeignKey("Frizeri.id", ondelete="CASCADE"))
    service_id = Column(Integer, ForeignKey("Usluge.id", ondelete="CASCADE"))
    price = Column(Float, nullable=False)

    hairdresser = relationship("Hairdresser", back_populates="services")
    service = relationship("Service", back_populates="hairdressers")
    reservations = relationship(
        "Reservations",
        back_populates="hairdresser_service"
    )

class WorkingHours(Base):
    __tablename__ = "Radno_vreme"

    id = Column(Integer, primary_key=True)
    hairdresser_id = Column(Integer, ForeignKey("Frizeri.id", ondelete="CASCADE"), nullable=False)
    weekday = Column(Enum(Weekday), nullable=False)
    start = Column(Time, nullable=True)
    end = Column(Time, nullable=True)
    off = Column(Boolean, nullable=False, default=False)

    hairdresser = relationship("Hairdresser", back_populates="working_hours")

    __table_args__ = (
        UniqueConstraint("hairdresser_id", "weekday", name="uq_hairdresser_weekday"),
    )


class WorkingHoursExceptions(Base):
    __tablename__ = "Radno_vreme_izuzeci"

    id = Column(Integer, primary_key=True)
    hairdresser_id = Column(Integer, ForeignKey("Frizeri.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    start = Column(Time, nullable=True)
    end = Column(Time, nullable=True)
    day_off = Column(Boolean, nullable=False, default=False)
    detail = Column(String(255), nullable=True)

    hairdresser = relationship("Hairdresser", back_populates="working_hours_exceptions")

    __table_args__ = (
        UniqueConstraint("hairdresser_id", "date", name="uq_hairdresser_date"),
    )

class WorkingHoursSalon(Base):
    __tablename__ = "Radno_vreme_saloni"

    id = Column(Integer, primary_key=True)
    salon_id = Column(Integer, ForeignKey("Saloni.id", ondelete="CASCADE"), nullable=False)
    weekday = Column(Enum(Weekday), nullable=False)
    start = Column(Time, nullable=True)
    end = Column(Time, nullable=True)
    day_off = Column(Boolean, nullable=False, default=False)

    salon = relationship("Salon", back_populates="working_hours_salon")

    __table_args__ = (
        UniqueConstraint("salon_id", "weekday", name="uq_salon_weekday"),
    )

class Reservations(Base):
    __tablename__ = "Rezervacije"

    id = Column(Integer, primary_key=True)
    hs_id = Column(Integer, ForeignKey("Usluge_po_frizeru.id", ondelete="SET NULL"))
    client_name = Column(String(255), nullable=False)
    client_phone = Column(String(35), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    hairdresser_service = relationship("Hairdresser_Service", back_populates="reservations")

    __table_args__ = (
        UniqueConstraint("hs_id", "start_time", name="uq_timeslot_hs_start"),
    )


    




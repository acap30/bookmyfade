from sqlalchemy import Column, Enum, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from db.schemas import Role

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
    
    owners = relationship("Owner", back_populates="user")
    hairdressers = relationship("Hairdresser", back_populates="user")

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
    address = Column(String(255))
    phone = Column(String(50))
    owners = relationship("Owner", back_populates="salon")
    hairdressers = relationship("Hairdresser", back_populates="salon")

class Hairdresser(Base):
    __tablename__ = "Frizeri"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable = False)
    salon_id = Column(Integer, ForeignKey("Saloni.id"), nullable=False)
    user = relationship("DbUser", back_populates="hairdressers")
    salon = relationship("Salon", back_populates="hairdressers")

class Service(Base):
    __tablename__ = "Usluge"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    length_minutes = Column(Integer, nullable=False)

class Hairdresser_Service(Base):
    __tablename__ = "Usluge_po_frizeru"

    hairdresser_id = Column(Integer, ForeignKey("Frizeri.id", ondelete="CASCADE"), primary_key = True)
    service_id = Column(Integer, ForeignKey("Usluge.id", ondelete="CASCADE"), primary_key = True)
    price = Column(Float, nullable=False)

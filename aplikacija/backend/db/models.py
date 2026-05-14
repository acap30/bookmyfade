from sqlalchemy import Column, Enum, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from db.schemas import Role

Base = declarative_base()

class DbUser(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=True)
    role = Column(Enum(Role), nullable=False)
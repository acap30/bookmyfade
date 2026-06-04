from typing import Optional
from pydantic import BaseModel
from enum import Enum
from datetime import time, datetime

class Role(str, Enum):
    ADMIN = "admin"
    OWNER = "owner"
    HAIRSTYLIST = "hairstylist"

class Weekday(int, Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7

class User(BaseModel):
    username:str
    email:str
    password:str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role:Role

class UserDisplay(BaseModel):
    id:int
    username:str
    email:str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role:Role

class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None

class UserAuth(BaseModel):
    id:int
    username:str
    email:str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role:Role

class OwnerDisplay(BaseModel):
    id: int
    user_id: int
    salon_id: int

    class Config:
        from_attributes = True

class SalonDisplay(BaseModel):
    id: int
    name: str
    address: str | None = None
    phone: str | None = None

    class Config:
        from_attributes = True

class HairdresserDisplay(BaseModel):
    id: int
    user_id: int
    salon_id: int

    class Config:
        from_attributes = True

class OwnerCreate(BaseModel):
    user_id: int
    salon_id: int

class SalonCreate(BaseModel):
    name: str
    address: str | None = None
    phone: str | None = None

class HairdresserCreate(BaseModel):
    user_id: int
    salon_id: int

class SalonUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None

class HairdresserUpdate(BaseModel):
    salon_id: int | None = None

class ServiceCreate(BaseModel):
    salon_id: int
    name: str
    length: int

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    length: Optional[int] = None

class ServiceLink(BaseModel):
    price: float

class ServiceLinkUpdate(BaseModel):
    price: Optional[float] = None

class ServiceCreateAndLink(BaseModel):
    salon_id: int
    name: str
    length: int
    price: float

class WorkingHoursCreate(BaseModel):
    hairdresser_id: int
    weekday: Weekday
    start: Optional[time] = None
    end: Optional[time] = None

class WorkingHoursUpdate(BaseModel):
    weekday: Optional[Weekday] = None
    start: Optional[time] = None
    end: Optional[time] = None

class ReservationCreate(BaseModel):
    hs_id: int
    client_name: str
    client_phone: str
    start_time: datetime
    end_time: datetime

class ReservationUpdate(BaseModel):
    hs_id: int | None = None
    client_name: str | None = None
    client_phone: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None

class ReservationDisplay(BaseModel):
    id: int
    hs_id: int
    client_name: str
    client_phone: str
    start_time: datetime
    end_time: datetime

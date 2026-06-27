from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from enum import Enum
from datetime import time, datetime, date

class Role(str, Enum):
    ADMIN = "admin"
    OWNER = "owner"
    HAIRSTYLIST = "hairstylist"

class Weekday(str, Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"

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
    email: Optional[str] = None
    phone_number: Optional[str] = None

class UserPassword(BaseModel):
    current: str
    new: str

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

class OwnerUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None
    email: str | None = None
    phone: str | None = None

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
    address: str
    phone: str | None = None
    email: str | None = None

class HairdresserCreate(BaseModel):
    user_id: int
    salon_id: int

class SalonUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None

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

class DaySchedule(BaseModel):
    start: Optional[time] = None
    end: Optional[time] = None
    off: bool

class WorkingHoursCreate(BaseModel):
    hairdresser_id: int
    weekday: Weekday
    start: Optional[time] = None
    end: Optional[time] = None
    off: bool

class WorkingHoursWeekCreate(BaseModel):
    hairdresser_id: int
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule

class WorkingHoursSalonWeekCreate(BaseModel):
    salon_id: int
    monday: DaySchedule | None = None
    tuesday: DaySchedule | None = None
    wednesday: DaySchedule | None = None
    thursday: DaySchedule | None = None
    friday: DaySchedule | None = None
    saturday: DaySchedule | None = None
    sunday: DaySchedule | None = None

class SalonDisplay(BaseModel):
    id: int
    name: str
    address: str
    phone: str | None = None
    email: str | None = None
    wh: Optional[WorkingHoursSalonWeekCreate] = None

    class Config:
        from_attributes = True


class WorkingHoursUpdate(BaseModel):
    weekday: Optional[Weekday] = None
    start: Optional[time] = None
    end: Optional[time] = None
    off: bool

class WorkingHoursWeekUpdate(BaseModel):
    monday: Optional[DaySchedule] = None
    tuesday: Optional[DaySchedule] = None
    wednesday: Optional[DaySchedule] = None
    thursday: Optional[DaySchedule] = None
    friday: Optional[DaySchedule] = None
    saturday: Optional[DaySchedule] = None
    sunday: Optional[DaySchedule] = None

class WorkingHoursExceptionCreate(BaseModel):
    hairdresser_id: int
    date: date
    start: Optional[time] = None
    end: Optional[time] = None
    day_off: bool
    detail: Optional[str] = None

class WorkingHoursExceptionDisplay(BaseModel):
    id: int
    hairdresser_id: int
    date: date
    start: Optional[time] = None
    end: Optional[time] = None
    day_off: bool
    detail: Optional[str] = None

class DaysOffCreate(BaseModel):
    hairdresser_id: int
    start: date
    end: date
    detail: Optional[str] = None

class DaysOffDelete(BaseModel):
    start: date
    end: date 
                
class DayOff(BaseModel):
    start_date: date
    end_date: date
    detail: Optional[str] = None

class DaysOffDisplay(BaseModel):
    hairdresser_id: int
    days: List[DayOff]

class WorkingHoursExceptionUpdate(BaseModel):
    start: Optional[time] = None
    end: Optional[time] = None
    day_off: Optional[bool] = None
    detail: Optional[str] = None

class ReservationService(BaseModel):
    id: int
    name: str
    length_minutes: int

class ReservationHairdresser(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str

class ReservationCreate(BaseModel):
    hs_id: int
    client_name: str
    client_phone: str
    res_date: date
    start_time: time
    end_time: time

class ReservationUpdate(BaseModel):
    hs_id: int | None = None
    client_name: str | None = None
    client_phone: str | None = None
    start_time: time | None = None
    end_time: time | None = None

class ReservationDisplay(BaseModel):
    id: int
    client_name: str
    client_phone: str
    res_date: date
    start_time: time
    end_time: time
    hairdresser: ReservationHairdresser
    service: ReservationService

    model_config = ConfigDict(from_attributes=True)

class ReservationWrapper(BaseModel):
    total: int
    skip: int
    limit: int
    data: list[ReservationDisplay]

# class Slots(BaseModel):
#     start: time
#     next: time

class Timeslots(BaseModel):
    hairdresser_id: int
    res_date: date
    service_id: Optional[int] = None
    slots: List[time]

class Service(BaseModel):
    hs_id: int
    name: str
    length: int
    price: float

class ServiceDisplay(BaseModel):
    res_date: date
    start: time
    services: List[Service]


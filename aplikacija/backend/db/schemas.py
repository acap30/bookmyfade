from typing import Optional
from pydantic import BaseModel
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    OWNER = "owner"
    HAIRSTYLIST = "hairstylist"

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
    name: str
    length: int

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    length: Optional[int] = None

from typing import Optional

from pydantic import BaseModel
from enum import Enum

class Role(Enum):
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

class UserAuth(BaseModel):
    id:int
    username:str
    email:str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role:Role
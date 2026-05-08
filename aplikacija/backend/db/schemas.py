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
    role:Role

class UserDisplay(BaseModel):
    id:int
    username:str
    email:str
    role:Role

class UserAuth(BaseModel):
    id:int
    username:str
    email:str
    role:Role
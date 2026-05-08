from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
import pymysql



class Settings(BaseSettings):
    db_name: str
    db_user: str
    db_password: str
    db_host: str = "localhost"
    db_port: int = 3306
    db_url: str

    class Config:
        env_file = ".env.local"

settings = Settings()

root_engine = create_engine(
    f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}"
)

with root_engine.connect() as connection:
    connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.db_name}"))

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
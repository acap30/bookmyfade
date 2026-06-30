from sqlalchemy.orm.session import Session
from db.schemas import User, UserDisplay, UserUpdate, Role, UserPassword
from db.database import get_db
from db.models import DbUser
from fastapi import HTTPException, UploadFile, status
from db.hashing import Hash
import os
import shutil

def create_admin():
    
    db = next(get_db())

    admin = DbUser(
        username='Admin',
        email='admin@example.com',
        password=Hash.bcrypt('admin'),
        first_name='Admin',
        last_name='Adminovski',
        role=Role.ADMIN
    )

    existing_user = db.query(DbUser).filter(DbUser.email == admin.email).first()
    if not existing_user:
    
        try:    
            db.add(admin)
            db.commit()
            db.refresh(admin)

            print("Admin created successfully")
        except Exception as e:
            db.rollback()
            print(f"Error occurred while creating superadmin: {e}")
    else:
        print("Admin already exists.")

def create_user(db: Session, request: User):
    
    existing_user = db.query(DbUser).filter(DbUser.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User with this email already exists'
        )
    
    new_user = DbUser(
        username = request.username,
        email = request.email,
        password = Hash.bcrypt(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        phone_number=request.phone_number,
        role = request.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"id": new_user.id}

def get_all_users(db: Session):

    return db.query(DbUser).all()

def get_user_by_id(db: Session, user_id: int):

    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found')
    
    return UserDisplay(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        role=user.role,
        image_url=user.image_url
    )

def update_user(db: Session, user_id: int, request: UserUpdate):

    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found')
    
    user.username = request.username if request.username is not None else user.username,
    user.first_name = request.first_name if request.first_name is not None else user.first_name,
    user.last_name = request.last_name if request.last_name is not None else user.last_name,
    user.email = request.email if request.email is not None else user.email,
    user.phone_number = request.phone_number if request.phone_number is not None else user.phone_number

    db.commit()
    db.refresh(user)

    return UserDisplay(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        role=user.role,
        image_url=user.image_url
    )

def update_password(db: Session, user_id: int, request: UserPassword):
    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found')
    
    if not Hash.verify(request.current, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="wrong password")
    
    user.password = Hash.bcrypt(request.new)

    db.commit()
    db.refresh(user)

    return {"message": "good"}


def delete_user(db: Session, user_id: int):

    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found')
    
    # if user.role == Role.ADMIN:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #         detail='Cannot delete admin')
    
    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

def upload_picture(file: UploadFile, db: Session, user_id: int):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    folder = "static/images/users"
    os.makedirs(folder, exist_ok=True)

    user = db.query(DbUser).filter(DbUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    file_path = f"{folder}/{user_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    if user.image_url:
        relative_path = user.image_url.lstrip("/") 
        old_path = os.path.join(BASE_DIR, relative_path)  
        if os.path.exists(old_path):
            os.remove(old_path)

    user.image_url = f"/{folder}/{user_id}_{file.filename}"
    db.commit()
    db.refresh(user)

    return {
        "message": "Image uploaded successfully",
        "url": f"/static/images/users/{user_id}_{file.filename}"
    }
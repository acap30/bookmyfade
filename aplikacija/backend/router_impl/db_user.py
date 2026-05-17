from sqlalchemy.orm.session import Session
from db.schemas import User, UserDisplay, Role
from db.database import get_db
from db.models import DbUser
from fastapi import HTTPException, status
from db.hashing import Hash

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

            print(f"Admin created successfully")
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
        role = Role.OWNER 
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return 'User added'

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
        role=user.role
    )
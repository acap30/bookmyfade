from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm.session import Session
from db.database import get_db
from db.models import DbUser
from db.hashing import Hash
from auth import oauth2
from datetime import timedelta
from jose import jwt, JWTError
from router_impl import db_user

router = APIRouter(
    tags=['authentication']
)

@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(DbUser).filter(DbUser.username == request.username).first()
    print(f"DEBUG: User found: {user}")
    if not user:
        print("DEBUG: User not found, returning 401")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid')
    result = Hash.verify(request.password, user.password)
    print(f"DEBUG: Hash.verify returned: {result}")
    if not Hash.verify(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                detail = 'Invalid credentials')
    
    access_token = oauth2.create_access_token(data={'id':user.id})
    refresh_token_expires = timedelta(hours=oauth2.REFRESH_TOKEN_EXPIRE_HOURS)
    refresh_token = oauth2.create_refresh_token(data={"id":user.id}, expires_delta=refresh_token_expires)

    return{
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer',
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': user.phone_number,
        'role': user.role,
        'image_url': user.image_url,
    }

@router.post('/refresh')
def refresh_token(token: str = Depends(oauth2.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, oauth2.SECRET_KEY, algorithms=[oauth2.ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db_user.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    access_token_expires = timedelta(minutes=oauth2.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = oauth2.create_access_token(data={"id": user_id}, expires_delta=access_token_expires)

    return {"access_token": new_access_token, "token_type": "bearer"}
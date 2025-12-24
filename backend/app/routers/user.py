from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import (
    TokenResponse,
    UserCreate, 
    UserResponse,
    UserLogin
)

from app.services.user_service import (
    create_user,
    authenticate_user
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


#kayıt
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)

def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    
    try:
        user = create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
#giriş
@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)

def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    token = authenticate_user(
        db,
        user_data.email,
        user_data.password
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz email veya şifre"
        )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
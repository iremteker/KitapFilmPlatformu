from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import hash_password
from app.schemas.user import UserCreate
from app.utils.security import verify_password, create_access_token

def create_user(db: Session, user_data: UserCreate) -> User:

    # email kontrolü
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise ValueError("Email zaten kayıtlı.")
    
    # username kontrolü
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise ValueError("Username zaten alınmış.")
    
    # şifre hashleme
    hashed_pw = hash_password(user_data.password[:72])

    # user oluşturma
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pw
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def authenticate_user(db: Session, email: str, password: str) -> str | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None

    token = create_access_token({"sub": str(user.id)})
    return token
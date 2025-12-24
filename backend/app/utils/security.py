from datetime import datetime, timedelta, timezone
import os
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    password_bytes = password_bytes[:72]
    return pwd_context.hash(password_bytes)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_minutes: Optional[int] = None) -> str:
    """
    data: token içine koyacağımız bilgiler (örn: {"sub": "1"})
    """
    to_encode = data.copy()

    minutes = expires_minutes if expires_minutes is not None else ACCESS_TOKEN_EXPIRE_MINUTES
    expire = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Token geçersizse {} döner.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return {}

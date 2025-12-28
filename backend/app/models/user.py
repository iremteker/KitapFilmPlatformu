from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    profile_image = Column(String, nullable=True)  # URL for profile image
    bio = Column(Text, nullable=True)  # About me section
    created_at = Column(DateTime(timezone=True), server_default=func.now())

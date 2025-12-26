from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class UserLibrary(Base):
    __tablename__ = "user_library"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False)  # 'book' or 'film'
    status = Column(String, default="added")  # reading, completed, watching, watched
    created_at = Column(DateTime(timezone=True), server_default=func.now())
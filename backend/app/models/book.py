from sqlalchemy import Column, Integer, String, Text
from app.database import Base
from sqlalchemy import DateTime
from sqlalchemy.sql import func

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    publish_year = Column(Integer)
    description = Column(Text)
    cover_image = Column(String) # URL or path to the cover image file
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
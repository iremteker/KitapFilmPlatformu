from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Film(Base):
    __tablename__ = "films"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    director = Column(String, nullable=False)
    release_year = Column(Integer)
    description = Column(Text)
    poster_image = Column(String) # URL or path to the poster image file

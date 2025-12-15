from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class ItemGenre(Base):
    __tablename__ = "item_genres"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False)  #'book' or 'movie'
    genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False)
    
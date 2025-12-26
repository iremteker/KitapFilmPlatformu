from typing import Optional
from pydantic import BaseModel


class FilmBase(BaseModel):
    title: str
    director: str
    release_year: Optional[int] = None
    description: Optional[str] = None
    poster_image: Optional[str] = None


class FilmCreate(FilmBase):
    pass


class FilmUpdate(BaseModel):
    title: Optional[str] = None
    director: Optional[str] = None
    release_year: Optional[int] = None
    description: Optional[str] = None
    poster_image: Optional[str] = None


class FilmResponse(FilmBase):
    id: int

    class Config:
        from_attributes = True

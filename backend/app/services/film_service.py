from sqlalchemy.orm import Session

from app.models import Film
from app.schemas.film import FilmCreate, FilmUpdate


def create_film(db: Session, film_data: FilmCreate) -> Film:
    film = Film(**film_data.dict())
    db.add(film)
    db.commit()
    db.refresh(film)
    return film


def get_all_films(db: Session):
    return db.query(Film).all()


def get_film_by_id(db: Session, film_id: int):
    return db.query(Film).filter(Film.id == film_id).first()


def update_film(db: Session, film_id: int, film_data: FilmUpdate):
    film = get_film_by_id(db, film_id)
    if not film:
        return None
    
    for key, value in film_data.model_dump(exclude_unset=True).items():
        setattr(film, key, value)

    db.commit()
    db.refresh(film)
    return film


def delete_film(db: Session, film_id: int):
    film = get_film_by_id(db, film_id)
    if not film:
        return None
    
    db.delete(film)
    db.commit()
    return film
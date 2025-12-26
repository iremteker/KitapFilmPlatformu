from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.film import FilmCreate, FilmUpdate, FilmResponse
from app.services.film_service import (
    create_film,
    get_all_films,
    get_film_by_id,
    update_film,
    delete_film,
)

router = APIRouter(
    prefix="/films",
    tags=["Films"]
)


@router.post("/", response_model=FilmResponse, status_code=status.HTTP_201_CREATED)
def create_film_endpoint(
    film_data: FilmCreate,
    db: Session = Depends(get_db)
):
    return create_film(db, film_data)


@router.get("/", response_model=list[FilmResponse])
def list_films(db: Session = Depends(get_db)):
    return get_all_films(db)


@router.get("/{film_id}", response_model=FilmResponse)
def get_film(film_id: int, db: Session = Depends(get_db)):
    film = get_film_by_id(db, film_id)
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")
    return film


@router.put("/{film_id}", response_model=FilmResponse)
def update_film_endpoint(
    film_id: int,
    film_data: FilmUpdate,
    db: Session = Depends(get_db)
):
    film = update_film(db, film_id, film_data)
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")
    return film


@router.delete("/{film_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_film_endpoint(film_id: int, db: Session = Depends(get_db)):
    film = delete_film(db, film_id)
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")

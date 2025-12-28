from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.film import FilmCreate, FilmResponse, FilmUpdate
from app.services.film_service import (
    create_film,
    get_all_films,
    delete_film,
    update_film
)
from app.dependencies.auth import require_admin

router = APIRouter(
    prefix="/films",
    tags=["Films"]
)

@router.get("/", response_model=list[FilmResponse])
def list_films(db: Session = Depends(get_db)):
    return get_all_films(db)

@router.post(
    "/admin",
    response_model=FilmResponse,
    status_code=status.HTTP_201_CREATED
)
def admin_create_film(
    film: FilmCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_film(db, film)

@router.put(
    "/admin/{film_id}",
    response_model=FilmResponse
)
def admin_update_film(
    film_id: int,
    film: FilmUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    updated_film = update_film(db, film_id, film)
    if not updated_film:
        raise HTTPException(status_code=404, detail="Film not found")
    return updated_film

@router.delete(
    "/admin/{film_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def admin_delete_film(
    film_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    success = delete_film(db, film_id)
    if not success:
        raise HTTPException(status_code=404, detail="Film not found")

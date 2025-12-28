from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import BookCreate, BookResponse, BookUpdate
from app.services.book_service import (
    create_book,
    get_all_books,
    delete_book,
    update_book
)
from app.dependencies.auth import require_admin

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.get("/", response_model=list[BookResponse])
def list_books(db: Session = Depends(get_db)):
    return get_all_books(db)

@router.post(
    "/admin",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED
)
def admin_create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_book(db, book)

@router.put(
    "/admin/{book_id}",
    response_model=BookResponse
)
def admin_update_book(
    book_id: int,
    book: BookUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    updated_book = update_book(db, book_id, book)
    if not updated_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

@router.delete(
    "/admin/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def admin_delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    success = delete_book(db, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")

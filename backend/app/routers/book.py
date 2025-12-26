from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.book import BookCreate, BookResponse
from app.services.book_service import (
    create_book,
    get_all_books,
    get_book_by_id,
    delete_book
)

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

# Create book
@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED
)
def create_book_endpoint(
    book_data: BookCreate,
    db: Session = Depends(get_db)
):
    return create_book(db, book_data)


# List all books
@router.get(
    "/",
    response_model=list[BookResponse]
)
def list_books(db: Session = Depends(get_db)):
    return get_all_books(db)


# Get single book
@router.get(
    "/{book_id}",
    response_model=BookResponse
)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# Delete book
@router.delete(
    "/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_book_endpoint(book_id: int, db: Session = Depends(get_db)):
    success = delete_book(db, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")

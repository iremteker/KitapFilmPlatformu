from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.book import Book
from app.schemas.book import BookCreate, BookResponse


router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED
)

def create_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(**book.dict())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.get(
    "/",
    response_model=list[BookResponse]
)

def list_books(db: Session = Depends(get_db)):
    return db.query(Book).all()
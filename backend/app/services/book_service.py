from sqlalchemy.orm import Session
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate


def create_book(db: Session, data: BookCreate) -> Book:
    book = Book(
        title=data.title,
        author=data.author,
        description=data.description,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


def get_all_books(db: Session) -> list[Book]:
    return db.query(Book).order_by(Book.id.desc()).all()


def get_book_by_id(db: Session, book_id: int) -> Book | None:
    return db.query(Book).filter(Book.id == book_id).first()


def update_book(db: Session, book_id: int, data: BookUpdate) -> Book | None:
    book = get_book_by_id(db, book_id)
    if not book:
        return None

    if data.title is not None:
        book.title = data.title
    if data.author is not None:
        book.author = data.author
    if data.description is not None:
        book.description = data.description

    db.commit()
    db.refresh(book)
    return book


def delete_book(db: Session, book_id: int) -> bool:
    book = get_book_by_id(db, book_id)
    if not book:
        return False

    db.delete(book)
    db.commit()
    return True

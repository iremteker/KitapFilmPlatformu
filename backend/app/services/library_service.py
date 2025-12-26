from sqlalchemy.orm import Session
from app.models.user_library import UserLibrary


def add_item_to_library(
    db: Session,
    user_id: int,
    item_id: int,
    item_type: str,
    status: str = "added"
) -> UserLibrary:
    library_item = UserLibrary(
        user_id=user_id,
        item_id=item_id,
        item_type=item_type,
        status=status
    )

    db.add(library_item)
    db.commit()
    db.refresh(library_item)
    return library_item


def get_user_library(db: Session, user_id: int) -> list[UserLibrary]:
    return (
        db.query(UserLibrary)
        .filter(UserLibrary.user_id == user_id)
        .order_by(UserLibrary.created_at.desc())
        .all()
    )

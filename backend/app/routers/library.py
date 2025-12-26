from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.library_service import (
    add_item_to_library,
    get_user_library
)

router = APIRouter(
    prefix="/library",
    tags=["Library"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def add_to_library(
    item_id: int,
    item_type: str,  # "book" or "film"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_item_to_library(
        db=db,
        user_id=current_user.id,
        item_id=item_id,
        item_type=item_type
    )


@router.get("/")
def list_my_library(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_library(db, current_user.id)

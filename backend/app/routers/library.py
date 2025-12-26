from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.library import LibraryCreate
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
    data: LibraryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_item_to_library(
        db=db,
        user_id=current_user.id,
        item_id=data.item_id,
        item_type=data.item_type,
        status=data.status
    )


@router.get("/")
def list_my_library(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_library(db, current_user.id)

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import (
    create_comment,
    get_comments_for_item
)

router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment_endpoint(
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_comment(db, current_user.id, comment_data)

@router.get("/item/{item_id}/{item_type}", response_model=list[CommentResponse])
def get_item_comments(
    item_id: int,
    item_type: str,
    db: Session = Depends(get_db)
):
    return get_comments_for_item(db, item_id, item_type)


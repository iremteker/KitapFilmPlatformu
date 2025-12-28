from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.rating import RatingCreate, RatingResponse
from app.services.rating_service import (
    create_or_update_rating,
    get_ratings_for_item,
    get_user_rating_for_item
)

router = APIRouter(
    prefix="/ratings",
    tags=["Ratings"]
)

@router.post("/", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def create_rating(
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Rating 1-5 arası olmalı
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    return create_or_update_rating(db, current_user.id, rating_data)

@router.get("/item/{item_id}/{item_type}", response_model=list[RatingResponse])
def get_item_ratings(
    item_id: int,
    item_type: str,
    db: Session = Depends(get_db)
):
    return get_ratings_for_item(db, item_id, item_type)

@router.get("/item/{item_id}/{item_type}/my", response_model=RatingResponse | None)
def get_my_rating(
    item_id: int,
    item_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_rating_for_item(db, current_user.id, item_id, item_type)


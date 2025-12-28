from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RatingCreate(BaseModel):
    item_id: int
    item_type: str  # 'book' or 'film'
    rating: int  # 1-5

class RatingResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    item_type: str
    rating: int
    created_at: datetime

    class Config:
        from_attributes = True


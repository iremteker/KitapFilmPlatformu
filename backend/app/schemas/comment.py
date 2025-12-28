from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    item_id: int
    item_type: str  # 'book' or 'film'
    comment: str

class CommentResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    item_type: str
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


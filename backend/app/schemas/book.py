from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
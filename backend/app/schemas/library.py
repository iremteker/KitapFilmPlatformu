from pydantic import BaseModel

class LibraryCreate(BaseModel):
    item_id: int
    item_type: str
    status: str

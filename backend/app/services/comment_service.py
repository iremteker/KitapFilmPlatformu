from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate

def create_comment(
    db: Session,
    user_id: int,
    comment_data: CommentCreate
) -> Comment:
    comment = Comment(
        user_id=user_id,
        item_id=comment_data.item_id,
        item_type=comment_data.item_type,
        comment=comment_data.comment
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments_for_item(
    db: Session,
    item_id: int,
    item_type: str
) -> list[Comment]:
    return (
        db.query(Comment)
        .filter(
            Comment.item_id == item_id,
            Comment.item_type == item_type
        )
        .order_by(Comment.created_at.desc())
        .all()
    )


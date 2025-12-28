from sqlalchemy.orm import Session
from app.models.rating import Rating
from app.schemas.rating import RatingCreate

def create_or_update_rating(
    db: Session,
    user_id: int,
    rating_data: RatingCreate
) -> Rating:
    # Kullanıcının bu item için daha önce puanı var mı kontrol et
    existing_rating = (
        db.query(Rating)
        .filter(
            Rating.user_id == user_id,
            Rating.item_id == rating_data.item_id,
            Rating.item_type == rating_data.item_type
        )
        .first()
    )

    if existing_rating:
        # Güncelle
        existing_rating.rating = rating_data.rating
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # Yeni oluştur
        rating = Rating(
            user_id=user_id,
            item_id=rating_data.item_id,
            item_type=rating_data.item_type,
            rating=rating_data.rating
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating

def get_ratings_for_item(
    db: Session,
    item_id: int,
    item_type: str
) -> list[Rating]:
    return (
        db.query(Rating)
        .filter(
            Rating.item_id == item_id,
            Rating.item_type == item_type
        )
        .all()
    )

def get_user_rating_for_item(
    db: Session,
    user_id: int,
    item_id: int,
    item_type: str
) -> Rating | None:
    return (
        db.query(Rating)
        .filter(
            Rating.user_id == user_id,
            Rating.item_id == item_id,
            Rating.item_type == item_type
        )
        .first()
    )


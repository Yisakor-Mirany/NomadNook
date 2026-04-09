"""
Business logic for favorites operations.
"""

from sqlalchemy.orm import Session
from typing import Optional
from app.models.models import Favorite, Place


def get_all_favorites(db: Session) -> list[Favorite]:
    """Return all favorited places with their full place data."""
    return db.query(Favorite).join(Place).order_by(Favorite.created_at.desc()).all()


def add_favorite(db: Session, place_id: int) -> Optional[Favorite]:
    """Add a place to favorites. Returns None if place doesn't exist."""
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        return None

    # Prevent duplicate favorites
    existing = db.query(Favorite).filter(Favorite.place_id == place_id).first()
    if existing:
        return existing

    favorite = Favorite(place_id=place_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


def remove_favorite(db: Session, place_id: int) -> bool:
    """Remove a place from favorites. Returns True if deleted, False if not found."""
    favorite = db.query(Favorite).filter(Favorite.place_id == place_id).first()
    if not favorite:
        return False
    db.delete(favorite)
    db.commit()
    return True

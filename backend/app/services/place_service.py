"""
Business logic for place-related operations.
Keeps routes thin by handling all DB queries here.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
from app.models.models import Place
from app.schemas.schemas import PlaceCreate


def get_all_places(
    db: Session,
    city: Optional[str] = None,
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_wifi_rating: Optional[int] = None,
    noise_level: Optional[str] = None,
    outlet_availability: Optional[str] = None,
    is_free: Optional[bool] = None,
    open_now: Optional[bool] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Place]:
    query = db.query(Place)

    # Text search across name, description, and address
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                Place.name.ilike(search_term),
                Place.description.ilike(search_term),
                Place.address.ilike(search_term),
                Place.tags.ilike(search_term),
            )
        )

    if city:
        query = query.filter(Place.city.ilike(f"%{city}%"))

    if category:
        query = query.filter(Place.category.ilike(f"%{category}%"))

    if min_wifi_rating is not None:
        query = query.filter(Place.wifi_rating >= min_wifi_rating)

    if noise_level:
        query = query.filter(Place.noise_level == noise_level)

    if outlet_availability:
        query = query.filter(Place.outlet_availability == outlet_availability)

    if is_free is not None:
        query = query.filter(Place.is_free == is_free)

    if open_now is not None:
        query = query.filter(Place.open_now == open_now)

    if min_rating is not None:
        query = query.filter(Place.rating >= min_rating)

    return query.order_by(Place.rating.desc()).offset(skip).limit(limit).all()


def get_place_by_id(db: Session, place_id: int) -> Optional[Place]:
    return db.query(Place).filter(Place.id == place_id).first()


def create_place(db: Session, place_data: PlaceCreate) -> Place:
    place = Place(**place_data.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place

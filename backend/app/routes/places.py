"""
Place routes — search, filter, and retrieve work/study spots.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database.database import get_db
from app.schemas.schemas import PlaceResponse
from app.services import place_service

router = APIRouter(prefix="/places", tags=["places"])


@router.get("/", response_model=List[PlaceResponse])
def list_places(
    city: Optional[str] = Query(None, description="Filter by city name"),
    search: Optional[str] = Query(None, description="Search in name, description, tags"),
    category: Optional[str] = Query(None, description="Filter by category (cafe, library, coworking)"),
    min_wifi_rating: Optional[int] = Query(None, ge=1, le=5, description="Minimum Wi-Fi rating (1-5)"),
    noise_level: Optional[str] = Query(None, description="quiet | moderate | loud"),
    outlet_availability: Optional[str] = Query(None, description="none | some | plenty"),
    is_free: Optional[bool] = Query(None, description="True for free venues"),
    open_now: Optional[bool] = Query(None, description="True to show only open venues"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum overall rating"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Return a filtered list of work/study spots.
    All filters are optional and can be combined.
    """
    places = place_service.get_all_places(
        db=db,
        city=city,
        search=search,
        category=category,
        min_wifi_rating=min_wifi_rating,
        noise_level=noise_level,
        outlet_availability=outlet_availability,
        is_free=is_free,
        open_now=open_now,
        min_rating=min_rating,
        skip=skip,
        limit=limit,
    )
    return places


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: int, db: Session = Depends(get_db)):
    """Return a single place by its ID."""
    place = place_service.get_place_by_id(db, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

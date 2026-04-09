"""
Favorites routes — save and retrieve favorite places.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.schemas import FavoriteCreate, FavoriteResponse
from app.services import favorite_service

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("/", response_model=List[FavoriteResponse])
def list_favorites(db: Session = Depends(get_db)):
    """Return all saved favorite places."""
    return favorite_service.get_all_favorites(db)


@router.post("/", response_model=FavoriteResponse, status_code=201)
def add_favorite(payload: FavoriteCreate, db: Session = Depends(get_db)):
    """Save a place to favorites by place_id."""
    favorite = favorite_service.add_favorite(db, payload.place_id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Place not found")
    return favorite


@router.delete("/{place_id}", status_code=204)
def remove_favorite(place_id: int, db: Session = Depends(get_db)):
    """Remove a place from favorites."""
    deleted = favorite_service.remove_favorite(db, place_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite not found")

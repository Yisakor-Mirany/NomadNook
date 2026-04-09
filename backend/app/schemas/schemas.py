"""
Pydantic schemas for request/response validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Place Schemas ─────────────────────────────────────────────────────────────

class PlaceBase(BaseModel):
    name: str
    category: str
    address: str
    city: str
    description: Optional[str] = None
    wifi_rating: Optional[int] = Field(default=0, ge=0, le=5)
    noise_level: Optional[str] = "moderate"
    outlet_availability: Optional[str] = "some"
    seating_comfort: Optional[int] = Field(default=3, ge=1, le=5)
    is_free: Optional[bool] = True
    open_now: Optional[bool] = True
    hours: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = Field(default=0.0, ge=0.0, le=5.0)
    review_count: Optional[int] = 0
    tags: Optional[str] = None
    image_url: Optional[str] = None


class PlaceCreate(PlaceBase):
    pass


class PlaceResponse(PlaceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Favorite Schemas ──────────────────────────────────────────────────────────

class FavoriteCreate(BaseModel):
    place_id: int


class FavoriteResponse(BaseModel):
    id: int
    place_id: int
    created_at: datetime
    place: PlaceResponse

    class Config:
        from_attributes = True


# ── Filter / Query Schemas ────────────────────────────────────────────────────

class PlaceFilters(BaseModel):
    city: Optional[str] = None
    search: Optional[str] = None
    category: Optional[str] = None
    min_wifi_rating: Optional[int] = Field(default=None, ge=1, le=5)
    noise_level: Optional[str] = None
    outlet_availability: Optional[str] = None
    is_free: Optional[bool] = None
    open_now: Optional[bool] = None
    min_rating: Optional[float] = Field(default=None, ge=0.0, le=5.0)

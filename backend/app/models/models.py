"""
SQLAlchemy ORM models for NomadNook.
Defines the database schema for places and favorites.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # cafe, library, coworking, etc.
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    description = Column(Text)

    # Productivity metrics (1-5 scale unless noted)
    wifi_rating = Column(Integer, default=0)           # 1-5
    noise_level = Column(String(20), default="moderate")  # quiet, moderate, loud
    outlet_availability = Column(String(20), default="some")  # none, some, plenty
    seating_comfort = Column(Integer, default=3)       # 1-5

    # Logistics
    is_free = Column(Boolean, default=True)
    open_now = Column(Boolean, default=True)
    hours = Column(String(500))  # JSON string or formatted text

    # Location
    latitude = Column(Float)
    longitude = Column(Float)

    # Meta
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    tags = Column(String(500))  # comma-separated tags
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    favorites = relationship("Favorite", back_populates="place", cascade="all, delete-orphan")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="favorites")

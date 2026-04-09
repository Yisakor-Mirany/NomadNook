"""
NomadNook FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database.database import engine, Base
from app.routes import places, favorites

# Create all tables on startup (use Alembic for production migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NomadNook API",
    description="Find the best cafes, libraries, and coworking spaces for remote work and study.",
    version="1.0.0",
)

# Allow the Vite dev server (and production build) to call the API
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(places.router)
app.include_router(favorites.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "NomadNook API is running"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}

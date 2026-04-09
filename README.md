# NomadNook

> Find your perfect work spot — cafes, libraries, and coworking spaces rated for Wi-Fi, noise, and comfort.

NomadNook is a full-stack web app for remote workers and students to discover productive places to work or study. Filter by Wi-Fi quality, noise level, outlet availability, open status, and more.

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS |
| Backend   | FastAPI (Python 3.11+)        |
| Database  | PostgreSQL                    |
| ORM       | SQLAlchemy 2.0                |
| Maps      | MapPlaceholder (Mapbox / Google Maps ready) |

---

## Project Structure

```
NomadNook/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + router registration
│   │   ├── database/
│   │   │   └── database.py      # SQLAlchemy engine & session
│   │   ├── models/
│   │   │   └── models.py        # Place, Favorite ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   ├── routes/
│   │   │   ├── places.py        # GET /places, GET /places/{id}
│   │   │   └── favorites.py     # GET/POST/DELETE /favorites
│   │   ├── services/
│   │   │   ├── place_service.py    # Place business logic
│   │   │   └── favorite_service.py # Favorites business logic
│   │   └── seed_data/
│   │       └── seed.py          # 10 realistic sample places
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/
        │   └── api.js           # Axios API client
        ├── hooks/
        │   └── usePlaces.js     # Data fetching hook with filters
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PlaceCard.jsx    # Card with Wi-Fi/noise/outlet metrics
        │   ├── SearchBar.jsx
        │   ├── FilterPanel.jsx  # Multi-filter controls
        │   ├── MapPlaceholder.jsx
        │   ├── LoadingSpinner.jsx
        │   └── EmptyState.jsx
        └── pages/
            ├── HomePage.jsx       # Search + filter + grid
            ├── PlaceDetailPage.jsx # Full place info + map
            └── FavoritesPage.jsx  # Saved places
```

---

## Database Schema

### `places`

| Column               | Type         | Description                           |
|----------------------|--------------|---------------------------------------|
| id                   | Integer PK   | Auto-increment                        |
| name                 | String       | Place name                            |
| category             | String       | cafe / library / coworking            |
| address              | String       | Full address                          |
| city                 | String       | City (indexed)                        |
| description          | Text         | Short description                     |
| wifi_rating          | Integer      | 1-5 scale                             |
| noise_level          | String       | quiet / moderate / loud               |
| outlet_availability  | String       | none / some / plenty                  |
| seating_comfort      | Integer      | 1-5 scale                             |
| is_free              | Boolean      | Free entry                            |
| open_now             | Boolean      | Currently open                        |
| hours                | String       | Human-readable hours                  |
| latitude / longitude | Float        | For map integration                   |
| rating               | Float        | Overall rating (0-5)                  |
| review_count         | Integer      | Number of reviews                     |
| tags                 | String       | Comma-separated tags                  |
| image_url            | String       | Hero image URL                        |
| created_at           | DateTime     | Row creation timestamp                |

### `favorites`

| Column     | Type        | Description             |
|------------|-------------|-------------------------|
| id         | Integer PK  | Auto-increment          |
| place_id   | FK -> places| Referenced place        |
| created_at | DateTime    | When favorited          |

---

## API Reference

### Places

| Method | Endpoint          | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | `/places`         | List all places (filterable)        |
| GET    | `/places/{id}`    | Get a single place by ID            |

**GET /places query parameters:**

| Param                 | Type    | Description                        |
|-----------------------|---------|------------------------------------|
| `search`              | string  | Full-text search (name, desc, tags)|
| `city`                | string  | Filter by city                     |
| `category`            | string  | cafe / library / coworking         |
| `min_wifi_rating`     | int 1-5 | Minimum Wi-Fi rating               |
| `noise_level`         | string  | quiet / moderate / loud            |
| `outlet_availability` | string  | none / some / plenty               |
| `is_free`             | boolean | Free venues only                   |
| `open_now`            | boolean | Currently open venues only         |
| `min_rating`          | float   | Minimum overall rating             |
| `skip` / `limit`      | int     | Pagination                         |

### Favorites

| Method | Endpoint                | Body               | Description             |
|--------|-------------------------|--------------------|-------------------------|
| GET    | `/favorites`            | -                  | List all favorites      |
| POST   | `/favorites`            | `{place_id: int}`  | Save a place            |
| DELETE | `/favorites/{place_id}` | -                  | Remove a favorite       |

---

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL running locally (or via Docker)

### 1. Clone and enter the project

```bash
git clone https://github.com/your-username/NomadNook.git
cd NomadNook
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL connection string

# Create the database (PostgreSQL must be running)
psql -U postgres -c "CREATE DATABASE nomadnook;"

# Seed sample data
python -m app.seed_data.seed

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000
Interactive docs: http://localhost:8000/docs

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at http://localhost:5173

The Vite dev server proxies `/api/*` requests to `http://localhost:8000`,
so no extra CORS configuration is needed during development.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/nomadnook
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Future Improvements

1. **Authentication** - JWT-based user accounts so favorites are per-user
2. **Interactive Map** - Replace MapPlaceholder with Mapbox GL JS or Google Maps
3. **User Reviews** - Allow users to submit ratings and review text
4. **Image Upload** - Let venue owners upload photos via S3 or Cloudinary
5. **Real-time Open Status** - Integrate Google Places API for live hours
6. **Docker Compose** - Containerize backend + frontend + postgres together
7. **Alembic Migrations** - Replace create_all with proper migration history
8. **Infinite Scroll** - Replace static limit with cursor-based pagination
9. **Venue Submission** - Public form for nomads to suggest new spots
10. **PWA / Offline Mode** - Cache favorites for offline access on mobile

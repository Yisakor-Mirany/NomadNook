"""
Seed script — populates the database with 10 realistic sample places.
Run with: python -m app.seed_data.seed
"""

import sys
import os

# Allow running as a module from the backend/ directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.database import SessionLocal, engine, Base
from app.models.models import Place

SAMPLE_PLACES = [
    {
        "name": "Verve Coffee Roasters",
        "category": "cafe",
        "address": "104 Bronson St, Santa Cruz, CA 95062",
        "city": "Santa Cruz",
        "description": "A beloved specialty coffee shop with fast Wi-Fi and a great vibe for deep work. Known for their single-origin pour-overs and airy interior.",
        "wifi_rating": 5,
        "noise_level": "moderate",
        "outlet_availability": "plenty",
        "seating_comfort": 4,
        "is_free": True,
        "open_now": True,
        "hours": "Mon-Fri 6am-7pm | Sat-Sun 7am-7pm",
        "latitude": 36.9741,
        "longitude": -122.0308,
        "rating": 4.7,
        "review_count": 312,
        "tags": "specialty coffee,fast wifi,natural light,hipster",
        "image_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    },
    {
        "name": "New York Public Library — Rose Main Reading Room",
        "category": "library",
        "address": "476 5th Ave, New York, NY 10018",
        "city": "New York",
        "description": "Iconic grand reading room with soaring ceilings, free Wi-Fi, and guaranteed quiet. The ultimate free study spot in Manhattan.",
        "wifi_rating": 4,
        "noise_level": "quiet",
        "outlet_availability": "some",
        "seating_comfort": 4,
        "is_free": True,
        "open_now": True,
        "hours": "Mon-Thu 10am-8pm | Fri-Sat 10am-6pm | Sun 1pm-5pm",
        "latitude": 40.7530,
        "longitude": -73.9822,
        "rating": 4.9,
        "review_count": 1840,
        "tags": "quiet,free,iconic,no food,study,research",
        "image_url": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    },
    {
        "name": "WeWork Fulton Center",
        "category": "coworking",
        "address": "222 Broadway, New York, NY 10038",
        "city": "New York",
        "description": "Premium coworking space with enterprise-grade Wi-Fi, standing desks, phone booths, and unlimited coffee. Day passes available.",
        "wifi_rating": 5,
        "noise_level": "moderate",
        "outlet_availability": "plenty",
        "seating_comfort": 5,
        "is_free": False,
        "open_now": True,
        "hours": "24/7 for members | Day pass: Mon-Fri 9am-6pm",
        "latitude": 40.7094,
        "longitude": -74.0093,
        "rating": 4.4,
        "review_count": 529,
        "tags": "coworking,paid,fast wifi,standing desk,phone booth,coffee included",
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    },
    {
        "name": "Sightglass Coffee",
        "category": "cafe",
        "address": "270 7th St, San Francisco, CA 94103",
        "city": "San Francisco",
        "description": "A warehouse-style cafe with two floors of seating, excellent espresso, and a productive atmosphere. Popular with the tech crowd.",
        "wifi_rating": 4,
        "noise_level": "moderate",
        "outlet_availability": "some",
        "seating_comfort": 3,
        "is_free": True,
        "open_now": True,
        "hours": "Mon-Fri 7am-6pm | Sat-Sun 8am-6pm",
        "latitude": 37.7749,
        "longitude": -122.4094,
        "rating": 4.5,
        "review_count": 874,
        "tags": "industrial,two floors,specialty coffee,tech crowd",
        "image_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    },
    {
        "name": "The Study at Yale",
        "category": "coworking",
        "address": "1157 Chapel St, New Haven, CT 06511",
        "city": "New Haven",
        "description": "A boutique hotel lobby repurposed as a stunning work space. Open seating, great Wi-Fi, and a full bar for the evening shift.",
        "wifi_rating": 4,
        "noise_level": "quiet",
        "outlet_availability": "some",
        "seating_comfort": 5,
        "is_free": True,
        "open_now": True,
        "hours": "Daily 7am-11pm",
        "latitude": 41.3083,
        "longitude": -72.9279,
        "rating": 4.6,
        "review_count": 203,
        "tags": "hotel lobby,elegant,quiet,bar,evening",
        "image_url": "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800",
    },
    {
        "name": "Boba Guys",
        "category": "cafe",
        "address": "3491 19th St, San Francisco, CA 94110",
        "city": "San Francisco",
        "description": "Trendy boba tea spot with good seating, decent Wi-Fi, and a lively neighborhood vibe. Great for creative work sessions.",
        "wifi_rating": 3,
        "noise_level": "moderate",
        "outlet_availability": "some",
        "seating_comfort": 3,
        "is_free": True,
        "open_now": True,
        "hours": "Daily 11am-9pm",
        "latitude": 37.7610,
        "longitude": -122.4194,
        "rating": 4.3,
        "review_count": 456,
        "tags": "boba,casual,creative,mission district",
        "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    },
    {
        "name": "Chicago Cultural Center",
        "category": "library",
        "address": "78 E Washington St, Chicago, IL 60602",
        "city": "Chicago",
        "description": "A breathtaking Beaux-Arts landmark with free Wi-Fi, quiet study areas, and regular cultural events. No food or drinks inside.",
        "wifi_rating": 3,
        "noise_level": "quiet",
        "outlet_availability": "none",
        "seating_comfort": 3,
        "is_free": True,
        "open_now": True,
        "hours": "Mon-Thu 9am-7pm | Fri 9am-6pm | Sat 9am-5pm | Sun 10am-3pm",
        "latitude": 41.8836,
        "longitude": -87.6249,
        "rating": 4.8,
        "review_count": 1102,
        "tags": "architecture,quiet,free,no food,cultural,historic",
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    },
    {
        "name": "Industrious Austin",
        "category": "coworking",
        "address": "600 Congress Ave, Austin, TX 78701",
        "city": "Austin",
        "description": "High-end coworking in the heart of downtown Austin. Gigabit internet, sit-stand desks, private offices, and a rooftop terrace.",
        "wifi_rating": 5,
        "noise_level": "quiet",
        "outlet_availability": "plenty",
        "seating_comfort": 5,
        "is_free": False,
        "open_now": True,
        "hours": "24/7 for members | Day pass: Mon-Fri 9am-5pm",
        "latitude": 30.2672,
        "longitude": -97.7431,
        "rating": 4.6,
        "review_count": 287,
        "tags": "coworking,paid,rooftop,gigabit,standing desk,private offices",
        "image_url": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    },
    {
        "name": "Stumptown Coffee — Ace Hotel Portland",
        "category": "cafe",
        "address": "1026 SW Stark St, Portland, OR 97205",
        "city": "Portland",
        "description": "The iconic Stumptown inside the Ace Hotel lobby. Moodily lit, reliably fast Wi-Fi, and surrounded by creatives. Busy on weekends.",
        "wifi_rating": 4,
        "noise_level": "moderate",
        "outlet_availability": "some",
        "seating_comfort": 4,
        "is_free": True,
        "open_now": True,
        "hours": "Daily 6am-8pm",
        "latitude": 45.5231,
        "longitude": -122.6765,
        "rating": 4.5,
        "review_count": 631,
        "tags": "iconic,hotel lobby,specialty coffee,creative,portland",
        "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    },
    {
        "name": "The Wing — SoHo",
        "category": "coworking",
        "address": "25 W Houston St, New York, NY 10012",
        "city": "New York",
        "description": "Women-focused coworking with beautiful interiors, fast dedicated Wi-Fi, private call booths, and a wellness room.",
        "wifi_rating": 5,
        "noise_level": "quiet",
        "outlet_availability": "plenty",
        "seating_comfort": 5,
        "is_free": False,
        "open_now": False,
        "hours": "Mon-Fri 8am-8pm | Sat 10am-6pm",
        "latitude": 40.7260,
        "longitude": -74.0022,
        "rating": 4.3,
        "review_count": 198,
        "tags": "women-focused,coworking,paid,private booths,wellness,soho",
        "image_url": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    },
]


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        existing = db.query(Place).count()
        if existing > 0:
            print(f"Database already has {existing} places. Skipping seed.")
            return

        for place_data in SAMPLE_PLACES:
            place = Place(**place_data)
            db.add(place)

        db.commit()
        print(f"Successfully seeded {len(SAMPLE_PLACES)} places.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

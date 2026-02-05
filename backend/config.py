import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./leadpulse.db")
SECRET_KEY = os.getenv("SECRET_KEY", "leadpulse-masterclass-secret-key-2025")
SESSION_COOKIE_NAME = "leadpulse_session"

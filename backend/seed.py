import bcrypt
from sqlalchemy.orm import Session

from models.user import User
from models.contact import Contact


def seed_data(db: Session):
    """Seed the database with demo data if empty."""
    if db.query(User).first():
        return

    password_hash = bcrypt.hashpw("demo1234".encode(), bcrypt.gensalt()).decode()
    demo_user = User(email="demo@leadpulse.ch", password_hash=password_hash, name="Demo User")
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    contacts = [
        Contact(
            user_id=demo_user.id,
            first_name="Sophie",
            last_name="Müller",
            email="sophie.mueller@migros.ch",
            phone="+41 79 123 45 67",
            company="Migros",
            job_title="Directrice Marketing",
            status="qualified",
            notes="Rencontrée au salon Swiss Marketing Forum. Intéressée par notre solution.",
        ),
        Contact(
            user_id=demo_user.id,
            first_name="Marc",
            last_name="Dubois",
            email="marc.dubois@swisscom.com",
            phone="+41 78 234 56 78",
            company="Swisscom",
            job_title="Head of Digital",
            status="contacted",
            notes="Premier appel effectué. À recontacter la semaine prochaine.",
        ),
        Contact(
            user_id=demo_user.id,
            first_name="Elena",
            last_name="Fontana",
            email="elena.fontana@rolex.com",
            phone="+41 76 345 67 89",
            company="Rolex",
            job_title="Innovation Manager",
            status="proposal",
            notes="Proposition envoyée le 15 janvier. En attente de retour du comité.",
        ),
        Contact(
            user_id=demo_user.id,
            first_name="Thomas",
            last_name="Keller",
            email="thomas.keller@nestle.com",
            phone="+41 79 456 78 90",
            company="Nestlé",
            job_title="VP Sales",
            status="new",
            notes="Contact obtenu via LinkedIn. Profil très intéressant.",
        ),
        Contact(
            user_id=demo_user.id,
            first_name="Laura",
            last_name="Bianchi",
            email="laura.bianchi@logitech.com",
            phone="+41 78 567 89 01",
            company="Logitech",
            job_title="Partnerships Lead",
            status="won",
            notes="Deal signé ! Contrat de 12 mois. Onboarding en cours.",
        ),
    ]
    db.add_all(contacts)
    db.commit()

    print(f"Seed: {len(contacts)} contacts créés pour {demo_user.email}")

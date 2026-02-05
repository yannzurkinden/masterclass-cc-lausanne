.PHONY: setup start start-backend start-frontend migrate clean

# Setup complet du projet
setup:
	@echo "Installation du backend..."
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@echo "Installation du frontend..."
	cd frontend && npm install
	@echo "Setup termine ! Lance 'make start' pour demarrer."

# Lancer les deux serveurs
start:
	@echo "Demarrage de LeadPulse..."
	@make start-backend &
	@make start-frontend

start-backend:
	@echo "Backend sur http://localhost:8000"
	cd backend && . venv/bin/activate && uvicorn main:app --reload --port 8000

start-frontend:
	@echo "Frontend sur http://localhost:5173"
	cd frontend && npm run dev

# Generer une migration apres modification des modeles
migrate:
	cd backend && . venv/bin/activate && alembic revision --autogenerate -m "$(msg)"

# Appliquer les migrations manuellement
upgrade:
	cd backend && . venv/bin/activate && alembic upgrade head

# Reset la base de donnees
clean:
	rm -f backend/leadpulse.db
	@echo "Base de donnees supprimee. Relance 'make start' pour recreer."

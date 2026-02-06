# Démarrage rapide

## Prérequis
- Python 3.13+ / uv
- Docker (optionnel)

## Installation

```bash
git clone <repo>
cd <projet>
uv sync
cp .env.example .env
docker compose up -d postgres
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

## Vérification

```bash
curl http://localhost:8000/health
open http://localhost:8000/docs
```

## Suite
- [Guide dev](./guides/DEVELOPMENT.md)
- [Architecture](./architecture/OVERVIEW.md)

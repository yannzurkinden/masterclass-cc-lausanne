# Troubleshooting

## Démarrage

### `ModuleNotFoundError`
**Cause** : Dépendances manquantes
```bash
uv sync
```

### `ConnectionRefusedError` (DB)
**Cause** : Base non démarrée
```bash
docker compose up -d postgres
```

### `Variable not set`
**Cause** : Env manquant
```bash
cp .env.example .env
```

## Auth

### `401 Unauthorized`
**Cause** : Token expiré/invalide
→ Regénérer : `POST /auth/login`

### `403 Forbidden`
**Cause** : Permissions insuffisantes
→ Vérifier rôles utilisateur

## Database

### `duplicate key`
**Cause** : Valeur déjà existante
→ Vérifier unicité ou `ON CONFLICT`

### `relation does not exist`
**Cause** : Migrations non appliquées
```bash
uv run alembic upgrade head
```

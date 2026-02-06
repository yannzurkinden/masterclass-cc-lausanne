# API Routes

## Structure
```
api/
├── routes/         # Endpoints par domaine
├── dependencies.py # Auth, DB session
└── exceptions.py   # Exceptions HTTP
```

## Conventions

| Méthode | Route | Fonction |
|---------|-------|----------|
| GET | `/resources` | `list_resources()` |
| GET | `/resources/{id}` | `get_resource()` |
| POST | `/resources` | `create_resource()` |
| PUT | `/resources/{id}` | `update_resource()` |
| DELETE | `/resources/{id}` | `delete_resource()` |

## Pattern endpoint

```python
@router.post("/", response_model=Response, status_code=201)
async def create_resource(
    data: CreateSchema,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Response:
    """Description de l'endpoint."""
    return await service.create(db, data, user)
```

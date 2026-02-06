# Exemples API

```bash
export API_URL="http://localhost:8000"
export TOKEN="votre-token"
```

## Auth

### Login
```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass"}'
```

## Resources

### Create
```bash
curl -X POST "$API_URL/resources" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "exemple"}'
```

### List
```bash
curl "$API_URL/resources?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Get
```bash
curl "$API_URL/resources/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

### Delete
```bash
curl -X DELETE "$API_URL/resources/{id}" \
  -H "Authorization: Bearer $TOKEN"
```

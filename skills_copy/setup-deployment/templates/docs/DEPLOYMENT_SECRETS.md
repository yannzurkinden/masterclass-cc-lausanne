# Secrets de Déploiement

Ce document liste tous les secrets nécessaires pour le déploiement de **{{PROJECT_NAME}}**.

## Configuration GitHub

Les secrets doivent être configurés dans : **Settings > Secrets and variables > Actions**

---

## 🔐 VPS (Obligatoires)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DEV_VPS_HOST` | IP ou hostname du VPS dev | `192.168.1.100` |
| `DEV_VPS_USER` | Utilisateur SSH | `deploy` |
| `DEV_VPS_SSH_KEY` | Clé SSH privée (format PEM) | `-----BEGIN OPENSSH...` |
| `PROD_VPS_HOST` | IP ou hostname du VPS prod | `10.0.0.50` |
| `PROD_VPS_USER` | Utilisateur SSH | `deploy` |
| `PROD_VPS_SSH_KEY` | Clé SSH privée (format PEM) | `-----BEGIN OPENSSH...` |

### Génération d'une clé SSH

```bash
# Générer une paire de clés
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key

# Copier la clé publique sur le VPS
ssh-copy-id -i deploy_key.pub user@vps-host

# Le contenu de deploy_key (privée) va dans le secret GitHub
```

---

## 🗄️ Database (Obligatoires)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DEV_DB_USER` | Utilisateur PostgreSQL | `app_dev` |
| `DEV_DB_PASSWORD` | Mot de passe PostgreSQL | `strong-password-here` |
| `DEV_DB_NAME` | Nom de la base | `{{PROJECT_NAME}}_dev` |
| `PROD_DB_USER` | Utilisateur PostgreSQL | `app_prod` |
| `PROD_DB_PASSWORD` | Mot de passe PostgreSQL | `very-strong-password` |
| `PROD_DB_NAME` | Nom de la base | `{{PROJECT_NAME}}_prod` |

### Génération d'un mot de passe sécurisé

```bash
# Linux/Mac
openssl rand -base64 32

# Ou avec Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🔒 Security (Obligatoires)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DEV_SECRET_KEY` | Clé secrète application | `64-char-random-string` |
| `DEV_CORS_ORIGINS` | Origins CORS autorisées | `https://dev.app.com` |
| `PROD_SECRET_KEY` | Clé secrète application | `different-64-char-string` |
| `PROD_CORS_ORIGINS` | Origins CORS autorisées | `https://app.com` |

### Génération d'une clé secrète

```bash
# Python
python -c "import secrets; print(secrets.token_hex(32))"

# OpenSSL
openssl rand -hex 32
```

---

{{#HAS_REDIS}}
## 📦 Redis (Optionnel)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DEV_REDIS_PASSWORD` | Mot de passe Redis | `redis-password` |
| `PROD_REDIS_PASSWORD` | Mot de passe Redis | `prod-redis-password` |

{{/HAS_REDIS}}

---

{{#HAS_S3}}
## ☁️ S3 Storage (Optionnel)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `S3_ENDPOINT` | URL endpoint S3 | `https://s3.eu-west-1.amazonaws.com` |
| `S3_ACCESS_KEY` | Access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `S3_SECRET_KEY` | Secret access key | `wJalrXUtnFEMI/K7MDENG/...` |
| `S3_BUCKET` | Nom du bucket | `my-app-uploads` |

### Fournisseurs S3 compatibles

- **AWS S3** : `https://s3.{region}.amazonaws.com`
- **Infomaniak** : `https://s3.pub1.infomaniak.cloud`
- **DigitalOcean Spaces** : `https://{region}.digitaloceanspaces.com`
- **Minio** : URL de votre instance

{{/HAS_S3}}

---

{{#HAS_SMTP}}
## 📧 SMTP (Optionnel)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USERNAME` | Utilisateur SMTP | `noreply@app.com` |
| `SMTP_PASSWORD` | Mot de passe SMTP | `app-password` |
| `SMTP_FROM_EMAIL` | Email expéditeur | `noreply@app.com` |

### Fournisseurs SMTP recommandés

| Fournisseur | Host | Port |
|-------------|------|------|
| Gmail | smtp.gmail.com | 587 |
| Infomaniak | mail.infomaniak.com | 587 |
| SendGrid | smtp.sendgrid.net | 587 |
| Mailgun | smtp.mailgun.org | 587 |

{{/HAS_SMTP}}

---

{{#HAS_TWILIO}}
## 📱 Twilio (Optionnel)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Auth Token | `your_auth_token` |
| `TWILIO_PHONE_NUMBER` | Numéro d'envoi | `+15551234567` |

### Configuration Twilio

1. Créer un compte sur [twilio.com](https://www.twilio.com)
2. Récupérer Account SID et Auth Token dans la console
3. Acheter ou configurer un numéro de téléphone

{{/HAS_TWILIO}}

---

## ✅ Checklist

### Dev
- [ ] `DEV_VPS_HOST`
- [ ] `DEV_VPS_USER`
- [ ] `DEV_VPS_SSH_KEY`
- [ ] `DEV_DB_USER`
- [ ] `DEV_DB_PASSWORD`
- [ ] `DEV_DB_NAME`
- [ ] `DEV_SECRET_KEY`
- [ ] `DEV_CORS_ORIGINS`
{{#HAS_REDIS}}
- [ ] `DEV_REDIS_PASSWORD`
{{/HAS_REDIS}}

### Prod
- [ ] `PROD_VPS_HOST`
- [ ] `PROD_VPS_USER`
- [ ] `PROD_VPS_SSH_KEY`
- [ ] `PROD_DB_USER`
- [ ] `PROD_DB_PASSWORD`
- [ ] `PROD_DB_NAME`
- [ ] `PROD_SECRET_KEY`
- [ ] `PROD_CORS_ORIGINS`
{{#HAS_REDIS}}
- [ ] `PROD_REDIS_PASSWORD`
{{/HAS_REDIS}}

### Services (partagés)
{{#HAS_S3}}
- [ ] `S3_ENDPOINT`
- [ ] `S3_ACCESS_KEY`
- [ ] `S3_SECRET_KEY`
- [ ] `S3_BUCKET`
{{/HAS_S3}}
{{#HAS_SMTP}}
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USERNAME`
- [ ] `SMTP_PASSWORD`
- [ ] `SMTP_FROM_EMAIL`
{{/HAS_SMTP}}
{{#HAS_TWILIO}}
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`
{{/HAS_TWILIO}}

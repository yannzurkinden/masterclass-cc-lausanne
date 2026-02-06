# Setup Deployment Skill

## Description

Automatise la mise en place d'un pipeline de déploiement CI/CD complet. Génère les Dockerfiles, docker-compose, GitHub Actions workflows, et configurations Caddy basés sur les bonnes pratiques.

## Slash Command

`/setup-deployment [OPTIONS]`

### Options

- `--analyze` : Analyse le projet et affiche un rapport sans modifier de fichiers
- `--minimal` : Génère uniquement Dockerfile + docker-compose.yml + deploy.yml basique
- `--force` : Écrase les fichiers existants sans demander confirmation

### Exemples

```bash
/setup-deployment              # Mode interactif complet
/setup-deployment --analyze    # Analyse uniquement
/setup-deployment --minimal    # Configuration minimale
```

---

## Instructions

Tu es un expert en DevOps et CI/CD. Ton rôle est de configurer un pipeline de déploiement complet pour le projet.

### Étape 1 : Détection de la Stack

Analyse le projet pour détecter :

1. **Backend** :
   - Cherche `pyproject.toml`, `requirements.txt` → Python/FastAPI
   - Vérifie la version Python dans `pyproject.toml` ou `.python-version`
   - Détecte le package manager (`uv.lock` → uv, `poetry.lock` → poetry)

2. **Frontend** :
   - Cherche `package.json` avec React/Vite
   - Vérifie le package manager (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn)
   - Identifie le framework (Vite, Next.js, CRA)

3. **Services** :
   - Redis : cherche `redis` dans les dépendances ou `REDIS_` dans le code
   - S3 : cherche `boto3`, `aioboto3`, ou `S3_` dans le code
   - SMTP : cherche `aiosmtplib`, `SMTP_` dans le code
   - Twilio : cherche `twilio` dans les dépendances

4. **Structure** :
   - Monorepo (`/backend`, `/frontend`) ou projets séparés
   - Présence de fichiers Docker existants

### Étape 2 : Mode Analyse (`--analyze`)

Si `--analyze` est spécifié, affiche un rapport détaillé :

```
╔══════════════════════════════════════════════════════════════╗
║                    ANALYSE DU PROJET                         ║
╠══════════════════════════════════════════════════════════════╣
║ Backend:                                                     ║
║   - Stack: Python 3.12 / FastAPI                            ║
║   - Package Manager: uv                                      ║
║   - Port détecté: 8000                                       ║
║                                                              ║
║ Frontend:                                                    ║
║   - Stack: React 18 / Vite 5                                ║
║   - Package Manager: pnpm                                    ║
║   - Port détecté: 5173                                       ║
║                                                              ║
║ Services détectés:                                           ║
║   ✓ PostgreSQL                                               ║
║   ✓ Redis                                                    ║
║   ✓ S3 (Infomaniak)                                         ║
║   ✓ SMTP                                                     ║
║   ✗ Twilio                                                   ║
║                                                              ║
║ Fichiers existants:                                          ║
║   ✓ docker-compose.yml (sera mis à jour)                    ║
║   ✗ Dockerfile backend (sera créé)                          ║
║   ✗ GitHub Actions (sera créé)                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Ne génère aucun fichier en mode analyse.**

### Étape 3 : Questions Interactives

Si pas en mode `--analyze`, pose ces questions avec AskUserQuestion :

**Question 1 : Configuration des domaines**
```
Quels sont vos domaines de déploiement ?
Options:
- [Personnalisé] Je vais entrer mes domaines
```
Si personnalisé, demande :
- Domaine dev (ex: dev.monapp.com)
- Domaine prod (ex: monapp.com)

**Question 2 : Organisation GitHub**
```
Quelle est votre organisation/username GitHub ?
```

**Question 3 : Chemin de déploiement VPS**
```
Quel est le chemin de déploiement sur le VPS ?
Options:
- /srv/{{PROJECT_NAME}} (Recommandé)
- /opt/{{PROJECT_NAME}}
- Personnalisé
```

**Question 4 : Services optionnels** (multiSelect)
```
Quels services souhaitez-vous configurer ?
Options:
- Redis (cache et sessions)
- S3 (stockage fichiers)
- SMTP (envoi d'emails)
- Twilio (SMS/2FA)
```

### Étape 4 : Génération des Fichiers

Lis les templates depuis ce dossier (`~/.claude/skills/setup-deployment/templates/`) et génère les fichiers adaptés.

**Variables à substituer dans les templates :**

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | Nom du projet (snake_case) | `ratios_app` |
| `{{GITHUB_ORG}}` | Organisation GitHub | `mon-org` |
| `{{DOMAIN_DEV}}` | Domaine développement | `dev.app.com` |
| `{{DOMAIN_PROD}}` | Domaine production | `app.com` |
| `{{PYTHON_VERSION}}` | Version Python | `3.12` |
| `{{NODE_VERSION}}` | Version Node | `20` |
| `{{BACKEND_PORT}}` | Port backend | `8000` |
| `{{FRONTEND_PORT}}` | Port frontend dev | `5173` |
| `{{DEPLOY_PATH}}` | Chemin VPS | `/srv/project` |
| `{{HAS_REDIS}}` | Redis activé | `true/false` |
| `{{HAS_S3}}` | S3 activé | `true/false` |
| `{{HAS_SMTP}}` | SMTP activé | `true/false` |
| `{{HAS_TWILIO}}` | Twilio activé | `true/false` |

**Fichiers à générer :**

Pour un projet avec backend + frontend :

```
.github/workflows/
├── deploy-dev.yml
└── deploy-prod.yml

backend/
├── Dockerfile
└── .dockerignore

frontend/
├── Dockerfile
├── nginx.conf
└── docker-entrypoint.sh

docker-compose.yml           # Dev local
docker-compose.dev.yml       # Deploy dev
docker-compose.prod.yml      # Deploy prod

deployment/
├── Caddyfile.dev
├── Caddyfile.prod
└── deploy.sh
```

### Étape 5 : Mode Minimal (`--minimal`)

Génère uniquement :
- `Dockerfile` (backend uniquement)
- `docker-compose.yml` (simplifié)
- `.github/workflows/deploy.yml` (workflow unique)

### Étape 6 : Récapitulatif Final

Après génération, affiche :

```
╔══════════════════════════════════════════════════════════════╗
║              DÉPLOIEMENT CONFIGURÉ AVEC SUCCÈS               ║
╠══════════════════════════════════════════════════════════════╣
║ Fichiers créés:                                              ║
║   ✓ .github/workflows/deploy-dev.yml                        ║
║   ✓ .github/workflows/deploy-prod.yml                       ║
║   ✓ backend/Dockerfile                                       ║
║   ✓ frontend/Dockerfile                                      ║
║   ✓ docker-compose.yml                                       ║
║   ✓ docker-compose.dev.yml                                   ║
║   ✓ docker-compose.prod.yml                                  ║
║   ✓ deployment/Caddyfile.dev                                ║
║   ✓ deployment/Caddyfile.prod                               ║
║   ✓ deployment/deploy.sh                                     ║
╠══════════════════════════════════════════════════════════════╣
║ SECRETS À CONFIGURER DANS GITHUB                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ 🔐 VPS (obligatoires):                                       ║
║   DEV_VPS_HOST      - IP ou hostname du VPS dev             ║
║   DEV_VPS_USER      - Utilisateur SSH                        ║
║   DEV_VPS_SSH_KEY   - Clé SSH privée                        ║
║   PROD_VPS_HOST     - IP ou hostname du VPS prod            ║
║   PROD_VPS_USER     - Utilisateur SSH                        ║
║   PROD_VPS_SSH_KEY  - Clé SSH privée                        ║
║                                                              ║
║ 🗄️ Database (obligatoires):                                  ║
║   DEV_DB_USER       - Utilisateur PostgreSQL                 ║
║   DEV_DB_PASSWORD   - Mot de passe PostgreSQL               ║
║   DEV_DB_NAME       - Nom de la base                        ║
║   PROD_DB_USER      - (idem pour prod)                      ║
║   PROD_DB_PASSWORD                                           ║
║   PROD_DB_NAME                                               ║
║                                                              ║
║ 🔒 Security (obligatoires):                                  ║
║   DEV_SECRET_KEY    - Clé secrète application               ║
║   DEV_CORS_ORIGINS  - Origins CORS autorisées               ║
║   PROD_SECRET_KEY                                            ║
║   PROD_CORS_ORIGINS                                          ║
║                                                              ║
║ 📦 Redis (si activé):                                        ║
║   DEV_REDIS_PASSWORD                                         ║
║   PROD_REDIS_PASSWORD                                        ║
║                                                              ║
║ ☁️ S3 (si activé):                                           ║
║   S3_ENDPOINT       - URL endpoint S3                        ║
║   S3_ACCESS_KEY     - Access key                             ║
║   S3_SECRET_KEY     - Secret key                             ║
║   S3_BUCKET         - Nom du bucket                          ║
║                                                              ║
║ 📧 SMTP (si activé):                                         ║
║   SMTP_HOST         - Serveur SMTP                           ║
║   SMTP_PORT         - Port (587 pour TLS)                   ║
║   SMTP_USERNAME     - Utilisateur SMTP                       ║
║   SMTP_PASSWORD     - Mot de passe SMTP                     ║
║   SMTP_FROM_EMAIL   - Email expéditeur                       ║
║                                                              ║
║ 📱 Twilio (si activé):                                       ║
║   TWILIO_ACCOUNT_SID                                         ║
║   TWILIO_AUTH_TOKEN                                          ║
║   TWILIO_PHONE_NUMBER                                        ║
╠══════════════════════════════════════════════════════════════╣
║ PROCHAINES ÉTAPES                                            ║
╠══════════════════════════════════════════════════════════════╣
║ 1. Configurer les secrets dans GitHub Settings > Secrets     ║
║ 2. Configurer Caddy sur le VPS (voir deployment/Caddyfile)  ║
║ 3. Push sur la branche 'dev' pour déclencher le déploiement ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Bonnes Pratiques Intégrées

### Sécurité

- **Non-root user** : Tous les Dockerfiles utilisent un user non-root (appuser:1000)
- **Réseaux isolés** : Les services internes (DB, Redis) sont sur un réseau `internal: true`
- **Health checks** : Tous les services ont des health checks configurés
- **Security headers** : Caddy configure HSTS, X-Frame-Options, CSP, etc.
- **Secrets** : Jamais de `.env` en production, tout passe par les secrets GitHub

### Fiabilité

- **Double tagging** : Images taguées avec `env` + `sha` pour rollback facile
- **Backup avant deploy** : Backup PostgreSQL automatique avant chaque déploiement
- **Health checks avec retry** : 30 tentatives avec intervalle de 10s
- **Concurrency control** : Un seul déploiement à la fois par environnement
- **Resource limits** : Limites CPU/mémoire dans docker-compose

### Maintenabilité

- **Cleanup automatique** : Images et backups > 7 jours supprimés
- **Préfixes environnement** : `DEV_`, `PROD_` pour tous les secrets
- **Logs structurés** : Format JSON pour parsing facile
- **Scripts documentés** : Chaque script explique ce qu'il fait

---

## Activation Automatique

Ce skill s'active automatiquement pour les tâches liées à :
- Configuration Docker ou docker-compose
- Mise en place de CI/CD ou GitHub Actions
- Configuration de reverse proxy (Nginx, Caddy)
- Déploiement sur VPS ou serveur
- Questions sur les secrets ou variables d'environnement

Globs: `**/Dockerfile*`, `**/docker-compose*.yml`, `**/.github/workflows/*.yml`, `**/Caddyfile*`, `**/nginx.conf`

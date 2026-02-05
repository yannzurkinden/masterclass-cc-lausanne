# LeadPulse — Mini CRM

Projet fil rouge pour la masterclass Claude Code. Un mini CRM personnel avec assistant IA integre.

## Demarrage rapide

### Prerequis

- Node.js 18+
- Python 3.11+

### Installation

```bash
git clone <url-du-repo>
cd leadpulse
make setup
```

### Lancer l'application

```bash
make start
```

L'application est accessible sur **http://localhost:5173**

### Compte demo

- Email : `demo@leadpulse.ch`
- Mot de passe : `demo1234`

## Stack technique

| Layer | Techno |
|-------|--------|
| Frontend | React + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Backend | FastAPI (Python) |
| Base de donnees | SQLite + SQLAlchemy |

## Structure du projet

```
leadpulse/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/   # Composants reutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilitaires et client API
│   └── ...
├── backend/           # API FastAPI
│   ├── models/        # Modeles SQLAlchemy
│   ├── routes/        # Endpoints API
│   ├── schemas/       # Schemas Pydantic
│   └── ...
├── CLAUDE.md          # Contexte pour Claude Code
└── Makefile           # Commandes utiles
```

## Commandes utiles

```bash
make setup          # Installation complete
make start          # Lancer frontend + backend
make clean          # Reset la base de donnees
```

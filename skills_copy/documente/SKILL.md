---
name: documente
description: Crée ou met à jour la documentation du projet avec ADRs, C4, et README distribués
argument-hint: "[--upgrade] [--adr] [path]"
disable-model-invocation: true
---

# Documentation de Projet

## Arguments

| Commande | Action |
|----------|--------|
| `/documente` | Crée la doc complète |
| `/documente src/api` | Documente un dossier |
| `/documente --upgrade` | Met à jour selon git diff |
| `/documente --adr "titre"` | Crée un ADR |

---

## Structure cible

```
docs/
├── TROUBLESHOOTING.md
├── architecture/
│   ├── OVERVIEW.md
│   ├── decisions/          # ADRs
│   └── diagrams/           # C4 (context, containers, components)
├── guides/
│   ├── GETTING_STARTED.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
└── api/
    ├── openapi.json        # Auto-généré
    └── EXAMPLES.md         # Curl copiables

src/
├── api/README.md           # Doc locale
├── services/README.md
└── models/README.md
```

---

## Workflow CREATE_FULL

1. **Explorer** le projet (structure, stack, patterns)
2. **Demander** : audience (junior/senior), langue, portée
3. **Créer** dans l'ordre :
   - Structure dossiers
   - Templates ADR + premiers ADRs détectés
   - Diagrammes C4 (3 niveaux)
   - TROUBLESHOOTING.md
   - GETTING_STARTED.md
   - README distribués (src/api/, src/services/...)
   - EXAMPLES.md (API)
   - Génération openapi.json si FastAPI

**IMPORTANT** : Avant de créer chaque fichier, lis le template correspondant dans `templates/` et adapte-le au projet.

---

## Workflow --upgrade

1. `git diff --name-only HEAD~10..HEAD` + `git diff --name-only`
2. Mapper fichiers → docs :
   - `src/api/**` → api/EXAMPLES.md, src/api/README.md
   - `src/services/**` → src/services/README.md, c4-components
   - `src/models/**` → c4-components
   - `Dockerfile` → DEPLOYMENT.md, c4-containers
3. Éditer chirurgicalement (pas réécrire)

---

## Workflow --adr

1. Compter ADRs existants → numéro suivant
2. Créer depuis [templates/adr.md](./templates/adr.md)
3. Pré-remplir titre + date

---

## Principes

- **ADRs** : documenter le pourquoi, pas juste le quoi
- **C4** : 3 niveaux (context → containers → components)
- **README locaux** : max 1 écran, conventions du dossier
- **Exemples API** : copiables avec `$API_URL` et `$TOKEN`
- **Troubleshooting** : cause + solution copiable

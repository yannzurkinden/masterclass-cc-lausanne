---
name: pushwithverif
description: Simplifie le code modifié, commit et push avec vérification
argument-hint: "[--doc] [branche-cible]"
disable-model-invocation: true
---

# Push avec vérification et simplification du code

## Parsing des arguments

Analyse `$ARGUMENTS` pour extraire :
- `--doc` : si présent, met à jour la documentation après simplification
- `branche-cible` : branche de comparaison (défaut: `main`)

Exemples :
- `/pushwithverif` → compare avec main, pas de doc
- `/pushwithverif develop` → compare avec develop, pas de doc
- `/pushwithverif --doc` → compare avec main, met à jour la doc
- `/pushwithverif --doc develop` → compare avec develop, met à jour la doc

---

## Étape 1 : Analyser les modifications

1. Récupère la branche actuelle : `git branch --show-current`
2. Détermine la branche cible (argument ou `main` par défaut)
3. Liste les fichiers modifiés : `git diff --name-only HEAD`
4. Liste aussi les fichiers staged : `git diff --cached --name-only`
5. Affiche un résumé des modifications à l'utilisateur

**Si aucun fichier modifié** → informe l'utilisateur et STOP.

---

## Étape 2 : Classifier les fichiers

Sépare les fichiers en catégories :

**Backend (Python)** :
- `*.py`

**Frontend (TypeScript/React)** :
- `*.ts`, `*.tsx`, `*.js`, `*.jsx`

**Documentation** :
- `*.md` dans `docs/`

**Autres** :
- Config, assets, etc. (pas de simplification)

---

## Étape 3 : Simplifier le code

Pour chaque catégorie de fichiers modifiés :

### Si fichiers Python détectés :
Lance l'agent `code-simplifier-backend` avec le Task tool :
```
Simplifie ces fichiers Python modifiés :
- [liste des fichiers .py]

Améliore la lisibilité et applique les conventions du projet.
Ne change pas le comportement du code.
```

### Si fichiers Frontend détectés :
Lance l'agent `code-simplifier-frontend` avec le Task tool :
```
Simplifie ces fichiers TypeScript/React modifiés :
- [liste des fichiers .ts/.tsx/.js/.jsx]

Améliore la lisibilité et applique les conventions du projet.
Ne change pas le comportement du code.
```

**Important** : Si les deux types existent, lance les deux agents **en parallèle**.

---

## Étape 4 : Vérification post-simplification

### Linters

**Python** :
```bash
uv run ruff check . --fix
uv run ruff format .
```

**Frontend** (si package.json existe) :
```bash
pnpm lint --fix 2>/dev/null || npm run lint --fix 2>/dev/null || true
```

### Tests

**Python** :
```bash
uv run pytest -x -q --tb=short
```

**Frontend** (si script test existe) :
```bash
pnpm test 2>/dev/null || npm test 2>/dev/null || true
```

**Si les tests échouent** :
1. Affiche les erreurs à l'utilisateur
2. Demande s'il veut continuer quand même (AskUserQuestion)
3. Si non → STOP (ne pas push)

---

## Étape 5 : Mise à jour documentation (si --doc)

**Uniquement si `--doc` est présent dans les arguments.**

1. Identifie les fichiers de code modifiés (pas les .md)
2. Détermine quelle documentation doit être mise à jour :

| Fichiers modifiés | Documentation impactée |
|-------------------|------------------------|
| `src/api/**`, `**/routes/**` | docs/api/API_REFERENCE.md |
| `src/models/**`, `**/schemas/**` | docs/architecture/ARCHITECTURE.md |
| `src/services/**` | docs/guides/SERVICES.md |
| `*.env*`, `config/**` | docs/guides/CONFIGURATION.md |
| `Dockerfile`, `docker-compose*` | docs/guides/DEPLOYMENT.md |

3. Pour chaque doc impactée :
   - Lis le fichier source modifié
   - Lis la doc existante
   - Met à jour les sections concernées (endpoints, fonctions, configs...)
   - Ne réécris pas tout, édite chirurgicalement

4. Affiche les docs mises à jour

---

## Étape 6 : Commit

1. Stage tous les fichiers modifiés :
   ```bash
   git add -A
   ```

2. Analyse les changements pour le message :
   ```bash
   git diff --cached --stat
   ```

3. Génère un message de commit clair :
   - Format conventional commits (feat:, fix:, refactor:, docs:, etc.)
   - Résume les changements principaux
   - Mentionne si code simplifié et/ou doc mise à jour

4. Crée le commit :
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <description courte>

   <détails des modifications>

   - Code simplifié par Claude
   - Documentation mise à jour (si applicable)
   EOF
   )"
   ```

---

## Étape 7 : Push

1. **Si branche = `main` ou `master`** :
   - Demande confirmation avec AskUserQuestion
   - Si refusé → STOP

2. Vérifie l'upstream :
   ```bash
   git rev-parse --abbrev-ref @{upstream} 2>/dev/null
   ```

3. Push :
   - Si pas d'upstream : `git push -u origin <branche>`
   - Sinon : `git push`

---

## Résumé final

Affiche à l'utilisateur :

```markdown
## Push effectué

| Catégorie | Fichiers | Action |
|-----------|----------|--------|
| Backend (Python) | 5 | Simplifiés |
| Frontend (TS/React) | 3 | Simplifiés |
| Documentation | 2 | Mises à jour |

**Commit** : `refactor(api): simplifie les endpoints utilisateurs`

**Branche** : feature/user-api → origin/feature/user-api

**Tests** : 42 passed

**Lien** : https://github.com/user/repo/tree/feature/user-api
```

---

## Règles de sécurité

- **DEMANDE CONFIRMATION** avant push sur `main`/`master`
- **STOP** si tests échouent (sauf override utilisateur)
- **NE MODIFIE PAS** les fichiers .env, credentials, secrets
- **IGNORE** les fichiers dans .gitignore

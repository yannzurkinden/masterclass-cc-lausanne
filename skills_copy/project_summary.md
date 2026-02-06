# Skill: Résumé Commercial de Projet

## Description

Ce skill analyse une codebase complète et génère un résumé orienté commercial pour le pôle ventes de Futurdigital. Le document produit permet aux commerciaux de comprendre rapidement un projet réalisé, ses bénéfices clients, et de l'utiliser comme référence lors de calls prospects.

## Déclencheurs

- `/project-summary` ou `/resume-projet`
- L'utilisateur demande de "résumer un projet"
- L'utilisateur mentionne "résumé commercial", "fiche projet", "case study"
- L'utilisateur veut documenter un projet pour les commerciaux

## Workflow

### Phase 1: Exploration de la Codebase

Utiliser un agent Explore avec niveau `very thorough` pour analyser :

1. **Architecture générale**
   - README.md et documentation existante
   - Structure du projet (services, modules, composants)
   - Technologies utilisées (package.json, pyproject.toml, requirements.txt, Dockerfile, etc.)

2. **Intégrations externes**
   - APIs tierces (Salesforce, Google, Azure, Stripe, etc.)
   - Services cloud (AWS, GCP, Azure, Infomaniak, etc.)
   - Bases de données et stockage

3. **Fonctionnalités métier**
   - Endpoints API (routes, controllers)
   - Modèles de données (schémas, entités)
   - Logique métier principale
   - Workflows et processus automatisés

4. **Configuration et déploiement**
   - Variables d'environnement (.env.example, config)
   - Containerisation (Docker)
   - CI/CD si présent

### Phase 2: Clarification avec l'utilisateur

Poser les questions suivantes pour compléter l'analyse :

1. **Client** :
   - Nom du client
   - Secteur/industrie
   - Pays/région (si pertinent)

2. **Contexte problématique** :
   - Quel était le problème principal du client ?
   - Comment le client gérait-il ce problème avant ? (processus manuel, outil existant, etc.)
   - Quels étaient les coûts/temps perdus estimés ?
   - Quelles étaient les erreurs ou frustrations récurrentes ?

3. **Résultats mesurables** (si disponibles) :
   - Gains de temps (avant/après)
   - Réduction d'erreurs
   - Augmentation de capacité
   - ROI estimé

4. **Nom du projet** :
   - Titre court et descriptif pour le résumé

### Phase 3: Génération du Résumé

Créer un fichier Markdown dans le dossier `Résumé des projets/` du repo intern avec la structure suivante :

```markdown
# [Nom du Projet]

> [Description courte en une phrase - accroche commerciale]

---

## Client

**[Nom Client]** - [Description courte] ([Pays])

## Industrie

[Secteur principal] / [Sous-secteur]

---

## Problématique client

### Avant : [Titre du problème]

| Problème | Impact |
|----------|--------|
| [Problème 1] | [Impact quantifié si possible] |
| [Problème 2] | [Impact] |
| ... | ... |

### Coût caché

- **[X] heures/semaine** de [tâche manuelle]
- [Autre coût ou frustration]
- [Impact business]

---

## Solution développée

### [Titre de la solution - ex: Pipeline de traitement avec IA]

```
[Diagramme ASCII simplifié du flux principal]
```

### Fonctionnalités clés

1. **[Fonctionnalité 1]**
   - Détail
   - Détail

2. **[Fonctionnalité 2]**
   - Détail

[... jusqu'à 6-8 fonctionnalités max]

---

## Résultats & ROI

### Gains de productivité

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| [Métrique 1] | [Valeur] | [Valeur] | **[%]** |
| [Métrique 2] | [Valeur] | [Valeur] | **[%]** |

### Bénéfices métier

- **[Bénéfice 1]** : Explication courte
- **[Bénéfice 2]** : Explication courte
- ...

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | [Framework] |
| Frontend | [Framework] (si applicable) |
| IA/ML | [Services IA] (si applicable) |
| Base de données | [DB] |
| Stockage | [Service] |
| Hébergement | [Plateforme] |
| ... | ... |

---

## Intégrations

### [Service 1 - ex: Salesforce]
- [Détail intégration]
- [Fonctionnalité]

### [Service 2]
- [Détail]

[... pour chaque intégration majeure]

---

## Cas d'usage type

1. [Étape 1 - déclencheur]
2. [Étape 2 - action système]
3. [Étape 3]
4. ...
5. [Résultat final]

**Temps total : ~[X] minute(s)** (vs [X]+ minutes en manuel)

---

## Contact

Développé par **Futurdigital SA**
```

### Phase 4: Nommage du fichier

Format du nom de fichier :
```
[Client] - [Nom court du projet].md
```

Exemples :
- `GS-Global - Extraction polices.md`
- `Entreprise X - Automatisation factures.md`
- `Client Y - Dashboard analytics.md`

### Phase 5: Validation

1. Relire le document généré
2. Vérifier que toutes les sections sont complètes
3. S'assurer que les métriques sont cohérentes
4. Proposer des améliorations si des informations manquent

## Bonnes Pratiques

### Orientation commerciale
- Toujours commencer par le **problème client** (douleur)
- Quantifier les gains avec des **chiffres concrets**
- Utiliser un vocabulaire **accessible** (pas trop technique)
- Mettre en avant le **ROI** et les **bénéfices business**

### Diagrammes ASCII
- Garder les diagrammes **simples et lisibles**
- Montrer le flux principal seulement
- Utiliser des emojis avec parcimonie pour la clarté

### Stack technique
- Lister les technologies **par catégorie**
- Mentionner les services **payants/enterprise** (argument de qualité)
- Inclure les certifications/compliance si pertinent

### Métriques
- Préférer les **pourcentages d'amélioration**
- Utiliser des comparaisons **avant/après**
- Si pas de chiffres exacts, utiliser des estimations réalistes avec "~"

## Informations à extraire automatiquement

La codebase peut révéler :

| Information | Où chercher |
|-------------|-------------|
| Stack backend | `pyproject.toml`, `requirements.txt`, `package.json`, `go.mod` |
| Stack frontend | `package.json`, dossiers `src/`, `app/`, `pages/` |
| Base de données | `docker-compose.yml`, configs, migrations |
| APIs externes | Imports, configs, `.env.example` |
| Hébergement | `Dockerfile`, `docker-compose.yml`, CI/CD configs |
| Fonctionnalités | Routes API, modèles, services |

## Output attendu

À la fin, confirmer :

```markdown
## Résumé Créé

- **Fichier** : `Résumé des projets/[Client] - [Projet].md`
- **Sections complètes** : X/10
- **Informations manquantes** : [liste si applicable]

Le résumé est prêt à être utilisé par l'équipe commerciale.
```

## Exemple d'utilisation

```
Utilisateur: "/project-summary" (dans le repo d'un projet client)

1. Lancer un agent Explore (very thorough) sur la codebase
2. Identifier stack, intégrations, fonctionnalités
3. Poser les questions (client, problématique, résultats)
4. Générer le fichier markdown dans intern/Résumé des projets/
5. Valider et résumer ce qui a été créé
```

## Notes importantes

- Le résumé doit pouvoir être **lu en 2-3 minutes**
- Un commercial doit comprendre **sans connaissances techniques**
- Les sections techniques (Stack, Intégrations) sont pour la crédibilité
- Toujours inclure un **cas d'usage concret** pour illustrer

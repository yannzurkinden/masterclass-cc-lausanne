---
description: Exécute un plan d'implémentation en orchestrant les agents d'équipe
argument-hint: [chemin-vers-le-plan]
model: opus
---

# Build

Exécute le plan d'implémentation situé à `CHEMIN_DU_PLAN` en orchestrant les agents d'équipe. Tu es le **chef d'équipe** : tu ne codes JAMAIS directement, tu délègues tout le travail aux agents via l'outil `Task`.

## Variables

CHEMIN_DU_PLAN: $ARGUMENTS

## Instructions

- Si aucun `CHEMIN_DU_PLAN` n'est fourni, STOP immédiatement et demande à l'utilisateur de le fournir (AskUserQuestion).
- Lis intégralement le plan à `CHEMIN_DU_PLAN`.
- Tu es le **chef d'équipe**. Tu ne codes JAMAIS directement. Tu orchestres les agents.
- Suis le `Workflow` pour exécuter le plan étape par étape.
- Respecte les dépendances entre tâches : ne lance jamais une tâche dont les dépendances ne sont pas terminées.
- Parallélise au maximum les tâches indépendantes avec `run_in_background: true`.
- Communique la progression à l'utilisateur à chaque phase majeure.

## Workflow

### 1. Lecture et analyse du plan
- Lis intégralement le fichier `CHEMIN_DU_PLAN`
- Identifie la section `## Étapes de réalisation` — c'est ta feuille de route
- Identifie la section `### Membres de l'équipe` — ce sont tes agents disponibles
- Note les dépendances entre tâches (`Dépend de`)

### 2. Initialisation des tâches
- Pour CHAQUE étape listée dans `## Étapes de réalisation`, crée une tâche avec `TaskCreate` :
  - `subject` : le nom de la tâche
  - `description` : le contenu complet de l'étape (actions, fichiers concernés, critères)
  - `activeForm` : une description courte au présent continu
- Configure les dépendances avec `TaskUpdate` + `addBlockedBy` selon le champ `Dépend de`
- Assigne les responsables avec `TaskUpdate` + `owner` selon le champ `Assignée à`

### 3. Exécution des tâches
Pour chaque tâche prête (aucune dépendance bloquante) :

**a) Lancer l'agent**
```
Task({
  description: "[nom de la tâche]",
  prompt: "[description complète + fichiers concernés + critères d'acceptation]",
  subagent_type: "[type d'agent du plan]",
  model: "opus",
  run_in_background: [true si marquée Parallèle: oui, false sinon]
})
```

**b) Contexte à fournir à chaque agent**
Chaque agent doit recevoir dans son prompt :
- La description précise de SA tâche
- Les fichiers concernés (depuis `## Fichiers concernés`)
- Les critères d'acceptation spécifiques à sa tâche
- Le chemin du plan pour référence : `CHEMIN_DU_PLAN`

**c) Suivi**
- Mets à jour le statut de la tâche à `in_progress` quand l'agent démarre
- Pour les agents en background : vérifie avec `TaskOutput` (block: false) régulièrement
- Quand un agent termine : marque la tâche `completed` et vérifie les tâches débloquées

### 4. Gestion des erreurs
Si un agent échoue ou produit un résultat incorrect :
1. Lis le rapport d'erreur
2. Reprends l'agent avec `resume` et des instructions correctives
3. Si 2 tentatives échouent sur la même tâche, signale le blocage à l'utilisateur avec `AskUserQuestion`

### 5. Validation
- Quand toutes les tâches de construction sont terminées, lance les tâches de validation
- Utilise les agents de type `validator` (lecture seule)
- Exécute les commandes de la section `## Commandes de validation` du plan
- Si la validation échoue : reprends le builder concerné avec les corrections à apporter

### 6. Rapport final
Suis la section `Rapport` ci-dessous.

## Règles d'orchestration

- **Ne JAMAIS coder directement** — Utilise uniquement `Task` pour déléguer
- **Paralléliser au maximum** — Lance les tâches indépendantes avec `run_in_background: true`
- **Contexte riche** — Chaque agent doit recevoir toutes les informations nécessaires dans son prompt
- **Suivi continu** — Mets à jour les statuts (`in_progress`, `completed`) au fur et à mesure
- **Reprendre plutôt que relancer** — Utilise `resume` pour les corrections, sauf si un contexte frais est préférable
- **Validation systématique** — Ne déclare jamais le travail terminé sans passer par les validateurs

## Rapport

Après exécution complète, présente ce rapport :

```
## Rapport d'exécution

**Plan** : [nom du plan]
**Statut** : Terminé | Partiel | Échoué

**Tâches complétées** :
- [tâche 1] — [résumé de ce qui a été fait]
- [tâche 2] — [résumé]

**Fichiers modifiés/créés** :
- [fichier] — [description du changement]

**Validation** :
- [commande] — [résultat]

**Problèmes rencontrés** (le cas échéant) :
- [problème et comment il a été résolu]
```

---
description: Crée un plan d'implémentation détaillé avec orchestration d'équipe multi-agents
argument-hint: [prompt utilisateur] [prompt d'orchestration]
model: opus
disallowed-tools: Task, EnterPlanMode
hooks:
  Stop:
    - hooks:
        - type: command
          command: >-
            uv run $HOME/.claude/hooks/validators/validate_new_file.py
            --directory specs
            --extension .md
        - type: command
          command: >-
            uv run $HOME/.claude/hooks/validators/validate_file_contains.py
            --directory specs
            --extension .md
            --contains '## Description de la tâche'
            --contains '## Objectif'
            --contains '## Fichiers concernés'
            --contains '## Étapes de réalisation'
            --contains '## Critères d acceptation'
            --contains '## Orchestration d équipe'
            --contains '### Membres de l équipe'
---

# Planifier avec équipe

Crée un plan d'implémentation détaillé basé sur les exigences de l'utilisateur fournies via la variable `PROMPT_UTILISATEUR`. Analyse la demande, réfléchis en profondeur à l'approche d'implémentation, et sauvegarde un document de spécification complet dans `REPERTOIRE_SORTIE/<nom-du-plan>.md` utilisable comme blueprint pour le développement. Suis les `Instructions` et le `Workflow` pour créer le plan.

## Variables

PROMPT_UTILISATEUR: $1
PROMPT_ORCHESTRATION: $2 - (Optionnel) Directives pour la composition d'équipe, la structure des tâches et la stratégie d'exécution
REPERTOIRE_SORTIE: `specs/`
MEMBRES_EQUIPE: `.claude/agents/team/*.md`
AGENT_GENERAL: `general-purpose`

## Instructions

- **PLANIFICATION UNIQUEMENT** : Ne PAS coder, construire ou déployer d'agents. Ta seule sortie est un document de plan sauvegardé dans `REPERTOIRE_SORTIE`.
- Si aucun `PROMPT_UTILISATEUR` n'est fourni, arrête-toi et demande à l'utilisateur de le fournir.
- Si `PROMPT_ORCHESTRATION` est fourni, utilise-le pour guider la composition d'équipe, la granularité des tâches, la structure des dépendances et les décisions parallèle/séquentiel.
- Analyse soigneusement les exigences de l'utilisateur fournies dans PROMPT_UTILISATEUR.
- Détermine le type de tâche (chore|feature|refactor|fix|enhancement) et la complexité (simple|moyenne|complexe).
- Réfléchis en profondeur (ultrathink) à la meilleure approche pour implémenter la fonctionnalité demandée ou résoudre le problème.
- Comprends le codebase directement (sans sous-agents) pour saisir les patterns et l'architecture existants.
- Suis le Format du Plan ci-dessous pour créer un plan d'implémentation complet.
- Inclus toutes les sections requises et les sections conditionnelles selon le type et la complexité de la tâche.
- Génère un nom de fichier descriptif en kebab-case basé sur le sujet principal du plan.
- Sauvegarde le plan complet dans `REPERTOIRE_SORTIE/<nom-descriptif>.md`.
- Assure-toi que le plan est suffisamment détaillé pour qu'un autre développeur puisse le suivre pour implémenter la solution.
- Inclus des exemples de code ou du pseudo-code quand c'est pertinent pour clarifier des concepts complexes.
- Prends en compte les cas limites, la gestion d'erreurs et les préoccupations de scalabilité.
- Tu es le chef d'équipe. Réfère-toi à la section `Orchestration d'équipe` pour plus de détails.

### Orchestration d'équipe

En tant que chef d'équipe, tu as accès à des outils puissants pour coordonner le travail entre plusieurs agents. Tu n'écris JAMAIS de code directement — tu orchestres les membres de l'équipe via ces outils.

#### Outils de gestion de tâches

**TaskCreate** — Créer une tâche dans la liste partagée :
```typescript
TaskCreate({
  subject: "Implémenter l'authentification",
  description: "Créer les endpoints login/logout avec JWT. Voir specs/auth-plan.md.",
  activeForm: "Implémentation de l'authentification"
})
// Retourne : taskId (ex: "1")
```

**TaskUpdate** — Mettre à jour le statut, l'assignation ou les dépendances :
```typescript
TaskUpdate({
  taskId: "1",
  status: "in_progress",  // pending → in_progress → completed
  owner: "builder-auth"
})
```

**TaskList** — Voir toutes les tâches et leur statut :
```typescript
TaskList({})
```

**TaskGet** — Obtenir les détails complets d'une tâche :
```typescript
TaskGet({ taskId: "1" })
```

#### Dépendances entre tâches

Utilise `addBlockedBy` pour créer des dépendances séquentielles :

```typescript
// La tâche 2 dépend de la tâche 1
TaskUpdate({ taskId: "2", addBlockedBy: ["1"] })

// La tâche 3 dépend des tâches 1 et 2
TaskUpdate({ taskId: "3", addBlockedBy: ["1", "2"] })
```

Exemple de chaîne :
```
Tâche 1: Fondations          → aucune dépendance
Tâche 2: Implémentation      → bloquée par: ["1"]
Tâche 3: Tests                → bloquée par: ["2"]
Tâche 4: Validation finale    → bloquée par: ["1", "2", "3"]
```

#### Déploiement d'agents avec Task

**Task** — Déployer un agent pour exécuter du travail :
```typescript
Task({
  description: "Implémenter les endpoints auth",
  prompt: "Implémente les endpoints d'authentification selon la Tâche 1...",
  subagent_type: "builder",
  model: "opus",  // ou "haiku" pour les tâches très simples
  run_in_background: false  // true pour exécution parallèle
})
// Retourne : agentId (ex: "a1b2c3")
```

#### Pattern de reprise (Resume)

Conserve l'agentId pour reprendre le travail d'un agent avec son contexte préservé :

```typescript
// Premier déploiement
Task({
  description: "Construire le service utilisateur",
  prompt: "Crée le service utilisateur avec les opérations CRUD...",
  subagent_type: "builder"
})
// Retourne : agentId: "abc123"

// Plus tard — reprendre le MÊME agent avec contexte préservé
Task({
  description: "Continuer le service utilisateur",
  prompt: "Ajoute la validation des entrées aux endpoints que tu as créés...",
  subagent_type: "builder",
  resume: "abc123"
})
```

Quand reprendre vs repartir à zéro :
- **Reprendre** : Travail lié, l'agent a besoin du contexte précédent
- **Nouveau** : Tâche sans rapport, table rase préférable

#### Exécution parallèle

Lance plusieurs agents simultanément avec `run_in_background: true` :

```typescript
// Lancer plusieurs agents en parallèle
Task({
  description: "Construire les endpoints API",
  prompt: "...",
  subagent_type: "builder",
  run_in_background: true
})

Task({
  description: "Construire les composants frontend",
  prompt: "...",
  subagent_type: "builder",
  run_in_background: true
})

// Vérifier la progression (non-bloquant)
TaskOutput({ task_id: "agentId", block: false, timeout: 5000 })

// Attendre la fin (bloquant)
TaskOutput({ task_id: "agentId", block: true, timeout: 300000 })
```

#### Workflow d'orchestration

1. **Créer les tâches** avec `TaskCreate` pour chaque étape du plan
2. **Définir les dépendances** avec `TaskUpdate` + `addBlockedBy`
3. **Assigner les responsables** avec `TaskUpdate` + `owner`
4. **Déployer les agents** avec `Task` pour exécuter le travail assigné
5. **Suivre la progression** avec `TaskList` et `TaskOutput`
6. **Reprendre les agents** avec `Task` + `resume` pour le travail de suivi
7. **Marquer comme terminé** avec `TaskUpdate` + `status: "completed"`

## Workflow

IMPORTANT : **PLANIFICATION UNIQUEMENT** — Ne pas exécuter, coder ou déployer. La sortie est un document de plan.

1. Analyser les exigences — Parse le PROMPT_UTILISATEUR pour comprendre le problème central et le résultat souhaité
2. Comprendre le codebase — Sans sous-agents, comprends directement les patterns, l'architecture et les fichiers pertinents
3. Concevoir la solution — Développe l'approche technique incluant les décisions d'architecture et la stratégie d'implémentation
4. Définir les membres de l'équipe — Utilise `PROMPT_ORCHESTRATION` (si fourni) pour guider la composition. Identifie depuis `.claude/agents/team/*.md` ou utilise `general-purpose`. Documente dans le plan.
5. Définir les étapes de réalisation — Utilise `PROMPT_ORCHESTRATION` (si fourni) pour guider la granularité et la structure parallèle/séquentielle. Rédige les tâches avec IDs, dépendances, assignations. Documente dans le plan.
6. Générer le nom de fichier — Crée un nom de fichier descriptif en kebab-case basé sur le sujet du plan
7. Sauvegarder le plan — Écris le plan dans `REPERTOIRE_SORTIE/<nom-fichier>.md`
8. Rapporter — Suis la section `Rapport` pour fournir un résumé des composants clés

## Format du Plan

- IMPORTANT : Remplace <contenu demandé> par le contenu approprié. C'est un template à remplir.
- IMPORTANT : Tout ce qui n'est PAS entre <contenu demandé> doit être écrit EXACTEMENT comme dans le format ci-dessous.
- IMPORTANT : Suis ce format EXACT lors de la création des plans :

```md
# Plan : <nom de la tâche>

## Description de la tâche
<décris la tâche en détail basé sur le prompt>

## Objectif
<indique clairement ce qui sera accompli quand ce plan sera terminé>

<si type_tâche est feature ou complexité est moyenne/complexe, inclure :>
## Problématique
<définis clairement le problème spécifique ou l'opportunité que cette tâche adresse>

## Approche de solution
<décris l'approche proposée et comment elle répond à l'objectif>
</si>

## Fichiers concernés
Utilise ces fichiers pour compléter la tâche :

<liste les fichiers pertinents avec des puces expliquant pourquoi. Inclus les nouveaux fichiers à créer sous un h3 'Nouveaux fichiers' si nécessaire>

<si complexité est moyenne/complexe, inclure :>
## Phases d'implémentation
### Phase 1 : Fondations
<décris le travail fondationnel nécessaire>

### Phase 2 : Implémentation principale
<décris le travail d'implémentation principal>

### Phase 3 : Intégration et finalisation
<décris l'intégration, les tests et les touches finales>
</si>

## Orchestration d équipe

- Tu opères en tant que chef d'équipe et orchestres l'équipe pour exécuter le plan.
- Tu es responsable de déployer les bons membres d'équipe avec le bon contexte.
- IMPORTANT : Tu n'opères JAMAIS directement sur le codebase. Tu utilises `Task` et `Task*` pour déléguer la construction, la validation, les tests et le déploiement.
  - C'est critique. Ton rôle est celui d'un directeur haut niveau, pas d'un builder.
  - Tu valides que tout se passe bien et t'assures que l'équipe est sur la bonne voie.
  - Tu orchestres via les outils Task* pour gérer la coordination entre les membres.
  - La communication est primordiale. Utilise les outils Task* pour communiquer et assurer le suivi.
- Note l'ID de session de chaque membre d'équipe pour les référencer.

### Membres de l équipe
<liste les membres d'équipe que tu utiliseras pour exécuter le plan>

- Builder
  - Nom : <nom unique pour ce builder — permet de le référencer. Il peut y en avoir plusieurs, le nom les distingue.>
  - Rôle : <le rôle unique et le focus de ce builder>
  - Type d'agent : <le subagent_type de ce builder, spécifié depuis les fichiers MEMBRES_EQUIPE ou AGENT_GENERAL>
  - Reprendre : <true par défaut. Permet à l'agent de continuer avec le même contexte. false pour repartir à zéro.>
- <continuer avec les membres supplémentaires dans le même format>

## Étapes de réalisation

- IMPORTANT : Exécute chaque étape dans l'ordre, de haut en bas. Chaque tâche correspond directement à un appel `TaskCreate`.
- Avant de commencer, lance `TaskCreate` pour créer la liste initiale que tous les membres peuvent voir et exécuter.

<liste les tâches étape par étape en h3. Commence par les fondations, puis l'implémentation, puis la validation.>

### 1. <Nom de la première tâche>
- **ID Tâche** : <identifiant unique en kebab-case, ex: "setup-database">
- **Dépend de** : <ID(s) de tâche dont celle-ci dépend, ou "aucune">
- **Assignée à** : <nom du membre d'équipe depuis la section Membres>
- **Type d'agent** : <subagent depuis MEMBRES_EQUIPE ou AGENT_GENERAL>
- **Parallèle** : <oui si peut tourner en même temps que d'autres, non si séquentiel>
- <action spécifique à réaliser>
- <action spécifique à réaliser>

### 2. <Nom de la deuxième tâche>
- **ID Tâche** : <identifiant-unique>
- **Dépend de** : <ID tâche précédente, ex: "setup-database">
- **Assignée à** : <nom du membre>
- **Type d'agent** : <type d'agent>
- **Parallèle** : <oui/non>
- <action spécifique>
- <action spécifique>

### 3. <Continuer le pattern>

### N. <Tâche de validation finale>
- **ID Tâche** : valider-tout
- **Dépend de** : <tous les IDs de tâches précédentes>
- **Assignée à** : <membre validateur>
- **Type d'agent** : <agent validateur>
- **Parallèle** : non
- Lancer toutes les commandes de validation
- Vérifier que les critères d'acceptation sont remplis

<continuer avec des tâches supplémentaires si nécessaire>

## Critères d acceptation
<liste des critères spécifiques et mesurables qui doivent être remplis pour que la tâche soit considérée comme terminée>

## Commandes de validation
Exécute ces commandes pour valider que la tâche est complète :

<liste les commandes spécifiques de validation. Sois précis sur ce qu'il faut lancer>
- Exemple : `uv run python -m py_compile apps/*.py` — Vérifie que le code compile

## Notes
<contexte additionnel optionnel, considérations ou dépendances. Si de nouvelles librairies sont nécessaires, spécifie avec `uv add`>
```

## Rapport

Après avoir créé et sauvegardé le plan, fournis un rapport concis dans ce format :

```
Plan d'implémentation créé

Fichier : REPERTOIRE_SORTIE/<nom-fichier>.md
Sujet : <brève description de ce que couvre le plan>
Composants clés :
- <composant principal 1>
- <composant principal 2>
- <composant principal 3>

Liste des tâches :
- <liste des tâches et responsable (concis)>

Membres de l'équipe :
- <liste des membres et leurs rôles (concis)>

Quand tu es prêt, tu peux exécuter le plan avec :
/build <remplacer par le chemin vers le plan>
```

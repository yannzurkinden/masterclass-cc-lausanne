---
name: test-gen
description: Génère des tests unitaires, tests logique métier et tests de régression
argument-hint: "[--unit|--business|--regression] [path]"
disable-model-invocation: true
---

# Générateur de Tests

## Arguments

| Commande | Action |
|----------|--------|
| `/test-gen` | Analyse et génère tous les types de tests |
| `/test-gen src/services` | Génère les tests pour un dossier spécifique |
| `/test-gen --unit` | Tests unitaires uniquement |
| `/test-gen --business` | Tests logique métier uniquement |
| `/test-gen --regression` | Tests de régression uniquement |
| `/test-gen --unit src/api` | Tests unitaires pour un path |

---

## Workflow

### 1. Détection du contexte

1. **Détecter le framework de test** :
   - Python : chercher `pytest.ini`, `pyproject.toml` (pytest), `setup.cfg`
   - JS/TS : chercher `jest.config.*`, `vitest.config.*`, `package.json`
   - Autre : demander à l'utilisateur

2. **Détecter la structure existante** :
   - Chercher dossier `tests/`, `__tests__/`, `spec/`
   - Analyser l'organisation (par type, par module, flat)

3. **Si path fourni** : limiter l'analyse à ce path

---

## Types de Tests

### --unit : Tests Unitaires

**Objectif** : Tester une fonction/méthode isolée

**Règles** :
- Une fonction = un fichier de test dédié ou une classe de test
- Mocker TOUTES les dépendances externes (DB, API, services)
- Pattern AAA : Arrange → Act → Assert
- Nommage : `test_<fonction>_should_<comportement>_when_<condition>`

**Quoi tester** :
- Cas nominal (happy path)
- Cas limites (empty, null, max values)
- Erreurs attendues (exceptions, validations)

**Exemple Python** :
```python
def test_calculate_total_should_return_sum_when_items_provided():
    # Arrange
    items = [{"price": 10}, {"price": 20}]

    # Act
    result = calculate_total(items)

    # Assert
    assert result == 30
```

---

### --business : Tests Logique Métier

**Objectif** : Valider les règles métier et workflows

**Règles** :
- Tester les services/use cases, pas les fonctions utilitaires
- Mocker uniquement les couches externes (DB, APIs tierces)
- Documenter la règle métier testée en commentaire
- Nommer selon le comportement métier

**Quoi tester** :
- Règles de validation métier
- Transitions d'état (commande → payée → expédiée)
- Calculs métier (prix, taxes, remises)
- Contraintes (limites, quotas, permissions)
- Workflows complets

**Exemple Python** :
```python
class TestOrderWorkflow:
    """Règle: Une commande ne peut être expédiée que si elle est payée"""

    def test_ship_order_should_succeed_when_order_is_paid(self):
        order = Order(status=OrderStatus.PAID)

        order.ship()

        assert order.status == OrderStatus.SHIPPED

    def test_ship_order_should_raise_when_order_not_paid(self):
        order = Order(status=OrderStatus.PENDING)

        with pytest.raises(BusinessRuleViolation):
            order.ship()
```

---

### --regression : Tests de Régression

**Objectif** : Empêcher la réapparition de bugs corrigés

**Règles** :
- Référencer le ticket/issue dans le nom et docstring
- Expliquer le bug original
- Reproduire le scénario exact qui causait le bug
- Placer dans `tests/regression/`

**Workflow** :
1. Demander à l'utilisateur le ticket/bug à couvrir
2. Demander le scénario de reproduction
3. Générer le test qui échouerait avec le bug

**Exemple Python** :
```python
def test_issue_123_user_email_validation_accepts_plus_sign():
    """
    Bug: Les emails avec '+' étaient rejetés (user+tag@example.com)
    Issue: #123
    Fix: Mise à jour de la regex de validation
    """
    # Ce scénario causait une erreur avant le fix
    email = "user+newsletter@example.com"

    result = validate_email(email)

    assert result is True
```

---

## Structure de Sortie

Adapter à la structure existante du projet. Si aucune structure :

```
tests/
├── conftest.py          # Fixtures partagées (pytest)
├── unit/
│   └── test_<module>.py
├── business/
│   └── test_<service>_rules.py
└── regression/
    └── test_issue_<numero>.py
```

---

## Principes

- **FIRST** : Fast, Isolated, Repeatable, Self-validating, Timely
- **Un test = un comportement** : pas de tests fourre-tout
- **Noms explicites** : le nom du test doit décrire le comportement attendu
- **Pas de logique dans les tests** : pas de if/else, boucles complexes
- **Fixtures réutilisables** : factoriser les setups communs
- **Coverage n'est pas qualité** : couvrir les cas importants, pas les lignes

# id09 — DTO d’entrée validé avec class-validator

## Role

Tu es un développeur backend senior NestJS (TypeScript), attentif à la validation des entrées, au respect des conventions du repo et à des changements minimaux, testables et lisibles.

## Objectif

Implémenter un DTO d’entrée validé via `class-validator` pour refuser les payloads invalides sur l’endpoint de recharge, conformément à la slide.

Livrable attendu (selon TODO) : un DTO (ex: `CreateRechargeDto`) avec des contraintes ; et un comportement observable du type « `amount = -5` → HTTP 400 (validation) ».

## Format de sortie

- Créer un DTO NestJS dans la feature `soldes` (fichier en `kebab-case`).
- Câbler ce DTO sur la route `POST /soldes/recharge`.
- Si nécessaire, ajouter la configuration minimale pour que la validation s’exécute (voir “Contraintes / Prérequis”).

## Contraintes

- Ne pas ajouter de “bonus” : uniquement DTO + validation du payload, strictement ce qui est requis par le slide et la tâche.
- Respecter les conventions de nommage et d’architecture décrites dans `CODING_RULES.md` (controller mince, DTO suffixé `Dto`, fichiers en `kebab-case`).
- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Ne pas implémenter la validation globale complète (c’est la tâche `id10`). Si un `ValidationPipe` est nécessaire pour rendre la validation effective, le faire au plus minimal (niveau route) ou demander confirmation pour faire `id10` avant.

## Contexte technique

- Tâche: `id09` dans `TODO.md`
- Slide source: `specifications/nestjs-backend-3j/03-validation-sql-services/09-code-example-dto-validation.yaml`
- Code existant:
  - `src/soldes/soldes.controller.ts` expose `POST /soldes/recharge` avec `@Body() body: { amount: number }`.
  - Dépendances actuelles: `class-validator` / `class-transformer` ne sont pas présentes dans `package.json`.

### Exigences tirées de la slide

Créer un DTO similaire à :

- `clientId`: string, longueur 3 à 36 (`@IsString()`, `@Length(3, 36)`)
- `amount`: entier strictement positif (`@IsInt()`, `@IsPositive()`)

La slide précise aussi : le DTO seul ne suffit pas, il faut activer un `ValidationPipe` pour déclencher la validation.

## Étapes (ordre recommandé)

1. Ajouter les dépendances de validation si absentes
   - Installer `class-validator` et `class-transformer`.

2. Créer le DTO
   - Créer un fichier de DTO dans la feature `soldes`, par ex:
     - `src/soldes/dto/create-recharge.dto.ts`
   - Définir la classe `CreateRechargeDto` conforme à la slide (décorateurs et types).

3. Utiliser le DTO dans le controller
   - Mettre à jour `POST /soldes/recharge` pour typer le body en `CreateRechargeDto`.
   - Décider quoi faire de `clientId` côté service (minimum acceptable):
     - soit garder la logique actuelle (service reçoit `amount` uniquement) et ignorer `clientId` pour l’instant,
     - soit faire évoluer la signature du service si c’est déjà nécessaire pour l’exercice (à garder minimal et cohérent).

4. Rendre la validation effective (prérequis / coordination avec `id10`)
   - Option A (recommandée si tu peux): faire d’abord `id10` (ValidationPipe global) puis revenir valider `id09`.
   - Option B (minimal, compatible avec l’état actuel): appliquer un `ValidationPipe` uniquement sur la route `POST /soldes/recharge` (ex: via `@UsePipes(...)`) pour obtenir le 400 sur payload invalide, sans introduire la config globale.

## Exemples

Requête valide (exemple aligné slide):

- `POST /soldes/recharge`
- Body:
  - `{ "clientId": "abc", "amount": 10 }`

Requêtes invalides attendues:

- `{ "clientId": "ab", "amount": 10 }` → 400 (clientId trop court)
- `{ "clientId": "abc", "amount": -5 }` → 400 (amount non positif)
- `{ "clientId": "abc", "amount": 10.5 }` → 400 (amount non entier)

## Critères de validation

- Le DTO `CreateRechargeDto` existe et reprend les contraintes de la slide (`IsString`, `Length(3, 36)`, `IsInt`, `IsPositive`).
- La route `POST /soldes/recharge` consomme ce DTO (signature `@Body() body: CreateRechargeDto`).
- Un payload invalide (ex: `amount: -5`) déclenche bien une erreur HTTP 400 (validation) via un mécanisme de validation (global si `id10` est fait, sinon local et minimal).
- Le code reste conforme aux conventions du repo (noms, séparation controller/service, changements minimaux).

# id07 — TP : créer le module Soldes (controller fin + service)

## Role

Tu es un développeur **senior NestJS / TypeScript**, rigoureux sur la séparation des responsabilités (controller vs service) et capable d’écrire des tests unitaires lisibles.

## Objectif

Implémenter (ou finaliser) un **domaine NestJS `soldes`** propre et opérationnel :

- un module `SoldesModule` qui déclare correctement controller(s) + provider(s)
- une route **GET** qui répond en **JSON**
- un **controller fin** (pas de logique métier)
- un **service injectable** dans lequel se trouve la logique

Référence fonctionnelle (slide) : `specifications/nestjs-backend-3j/02-demarrage-nestjs/18-exercise-tp-soldes.yaml`.

## Format de sortie

Modifications attendues dans le code NestJS (pas de nouveaux dossiers hors `src/` et `test/`) :

- `src/soldes/soldes.module.ts`
- `src/soldes/soldes.controller.ts`
- `src/soldes/soldes.service.ts`
- (si nécessaire) tests :
  - `src/soldes/soldes.controller.spec.ts`
  - `src/soldes/soldes.service.spec.ts`

Aucun autre livrable.

## Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md`.
- Ne pas ajouter de “bonus features” : rester strictement sur le TP.
- Controller : uniquement routage + extraction params/body + appel service.
- Service : logique métier (même minimale) et injectable (`@Injectable`).
- Garder le code simple (KISS) et cohérent avec l’existant.
- Ne pas introduire de dépendances externes (pas de DB, pas de config, pas de validation globale : ce sera dans les tâches suivantes).

## Contexte technique

État actuel du code (important pour éviter de repartir de zéro) :

- Le dossier `src/soldes/` existe déjà avec :
  - `soldes.module.ts` (déclare `SoldesController`, `ClientsController`, `SoldesService`)
  - `soldes.controller.ts` expose `GET /soldes/ping` et `POST /soldes/recharge`
  - `soldes.service.ts` expose `getBalance(clientId: number)` (utilisé par `ClientsController`)
  - `clients.controller.ts` expose `GET /clients/:id/soldes` et injecte déjà `SoldesService`
- `AppModule` importe `SoldesModule` (`src/app.module.ts`).

Attendus du TP (slide) :

- Générer/câbler module/controller/service
- Ajouter une route GET (`/soldes/ping` **ou** `/soldes/:id`)
- Déplacer la logique dans `SoldesService`
- Injecter `SoldesService` dans `SoldesController`
- Tester avec curl et vérifier une réponse JSON

## Étapes (recommandées)

1. **Choisir la route GET** à conserver pour le TP :
   - Option simple recommandée : garder `GET /soldes/ping`.
   - Option alternative : `GET /soldes/:id` (si tu veux réutiliser `getBalance`).
2. **Déplacer la logique** de la route GET dans `SoldesService`.
   - Créer une méthode dédiée (ex: `ping()` ou `getPing()`), ou réutiliser `getBalance()` si la route est paramétrée.
3. **Injecter `SoldesService` dans `SoldesController`** via le constructeur et déléguer l’implémentation de la route GET au service.
4. Vérifier que `SoldesModule` déclare toujours correctement `controllers` et `providers`.
5. **Mettre à jour les tests unitaires** pour refléter la nouvelle séparation :
   - Soit en mockant le service dans le test du controller (controller « fin »),
   - Soit en adaptant l’existant si le test appelle directement la méthode du controller.
6. Vérifier manuellement le comportement via `curl` (voir exemples).

## Exemples (curl)

Adapter selon la route GET choisie.

### Si `GET /soldes/ping`

- `curl http://localhost:3000/soldes/ping`
- Réponse attendue : JSON (au minimum un objet), ex: `{ "ok": true }`

### Si `GET /soldes/:id`

- `curl http://localhost:3000/soldes/1`
- Réponse attendue : JSON (au minimum un objet), ex: `{ "clientId": 1, "balance": 0 }`

## Tests

- Unit tests :
  - `npm test`
  - Vérifier que les tests de `SoldesController` et `SoldesService` passent.
- (Optionnel si déjà présent) Vérifier que le module compile et démarre :
  - `npm run start:dev`

## Critères de validation

- [ ] Une route **GET** répond en **JSON** (selon la route choisie).
- [ ] `SoldesController` injecte `SoldesService` et délègue la logique.
- [ ] `SoldesService` porte la logique (même minimale) et reste testable.
- [ ] `SoldesModule` déclare correctement `controllers` et `providers`.
- [ ] Les tests unitaires existants sont mis à jour et passent (`npm test`).

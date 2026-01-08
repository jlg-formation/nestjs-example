# id01 — Bootstrapper le projet NestJS (structure + scripts)

## Role

Tu es un développeur backend senior spécialisé en **NestJS** et **TypeScript**, rigoureux sur la qualité (scripts, lint, tests) et sur la conformité à une structure Nest standard.

## Objectif

Mettre en place un projet NestJS **standard et exécutable** :

- l’application démarre en mode dev via un script npm ;
- une route de base est accessible (au minimum `GET /`) ;
- la structure (fichiers/entrypoints) correspond aux conventions Nest.

Cette tâche correspond au slide : `specifications/nestjs-backend-3j/02-demarrage-nestjs/04-process-bootstrap-projet.yaml`.

## Format de sortie

Modifications attendues uniquement dans le codebase Nest (pas de fichiers “bonus”) :

- `package.json` : scripts de base pour dev/build/test/lint/format (ou vérification si déjà présents).
- `src/main.ts` : bootstrap Nest standard avec `NestFactory.create(AppModule)` et `listen`.
- `src/app.module.ts` : module racine minimal.
- `src/app.controller.ts` + `src/app.service.ts` : endpoint de base (ex: `GET /` renvoyant une string).
- Fichiers de config Nest/TS déjà attendus par le scaffold : `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json` (vérifier qu’ils existent et sont cohérents).

## Contraintes

- Ne pas implémenter de feature métier (pas de module `soldes` ici : ce sera une tâche suivante).
- Rester sur une structure **Nest CLI** classique (pas d’architecture personnalisée prématurée).
- Respecter les conventions décrites dans `AGENTS.md` et `CODING_RULES.md` : simplicité, controllers minces.
- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Ne pas “inventer” des scripts/outils : utiliser ce qui est pertinent pour un scaffold Nest (Prettier/ESLint/Jest) et ce que le repo contient déjà.

## Contexte technique

État actuel du repo (à utiliser comme base, adapter seulement si nécessaire) :

- Scripts npm déjà présents dans `package.json` (start/dev/build/lint/test…).
- Bootstrap actuel dans `src/main.ts`.
- Route de base `GET /` dans `src/app.controller.ts`.
- Module racine `src/app.module.ts`.

Exigences de la slide (process) :

- Installer le Nest CLI (si nécessaire côté machine)
- Créer le projet
- Lancer en dev et vérifier `/`
- Lire/valider la structure (`src`, `app.module`, `app.controller`)

## Étapes (ordre recommandé)

1. Vérifier la structure minimale Nest : présence de `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts`, `src/app.service.ts`.
2. Vérifier les scripts `package.json` pour :
   - dev : `start:dev`
   - build : `build`
   - lint : `lint`
   - format : `format`
   - tests : `test` et `test:e2e` (si déjà configuré)
3. Vérifier que `GET /` répond (retour simple, ex: string) et que l’app écoute sur un port par défaut (ex: `3000`).
4. Exécuter localement (en commande) :
   - `npm install`
   - `npm run start:dev`
   - Optionnel : `npm run test` et `npm run lint` si déjà en place.

## Critères de validation

- `npm run start:dev` démarre sans erreur.
- Un `GET /` renvoie une réponse (status 200) via `AppController`.
- Le bootstrap suit le pattern Nest : `NestFactory.create(AppModule)` puis `app.listen(...)`.
- Les scripts de base existent dans `package.json` (ou sont ajoutés si manquants) et pointent vers des commandes Nest/Jest/ESLint/Prettier cohérentes.
- La structure reste minimale : pas de module métier ajouté à cette étape.

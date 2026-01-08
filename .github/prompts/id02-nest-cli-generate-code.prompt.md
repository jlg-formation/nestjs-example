# id02 — Utiliser Nest CLI pour générer du code (module/controller/service)

## Role

Tu es un développeur senior **NestJS (TypeScript)**, à l’aise avec **Nest CLI**, la génération via **schematics**, et les bonnes pratiques d’architecture **modules / controllers / services**.

## Objectif

Implémenter la tâche **id02** : utiliser **Nest CLI** pour générer du code NestJS (au minimum **un module**, **un controller**, **un service**) afin de pratiquer l’outillage.

Livrable attendu (selon TODO) : **génération via CLI** sans casser le démarrage du projet.

## Format de sortie

Le résultat doit être une modification du codebase existant (pas un nouveau projet) et inclure :

- Un nouveau module de feature (recommandé : `soldes`) généré via CLI
- Un controller associé généré via CLI
- Un service associé généré via CLI
- Le câblage minimal pour que l’application **démarre toujours** (en particulier, si nécessaire : import du module dans `AppModule`)

Fichiers typiquement attendus (si tu utilises le nom `soldes`) :

- `src/soldes/soldes.module.ts`
- `src/soldes/soldes.controller.ts`
- `src/soldes/soldes.service.ts`

Note : selon les options CLI, des fichiers `*.spec.ts` peuvent aussi être générés. C’est acceptable tant que le projet continue de démarrer et que les tests/lint restent cohérents.

## Contraintes

- Utiliser **Nest CLI** (génération) plutôt que créer ces fichiers “à la main”.
- Ne pas implémenter de fonctionnalités au-delà du squelette généré :
  - pas de nouvelles routes métier (elles arrivent dans les tâches suivantes)
  - pas de logique métier additionnelle
- Ne pas casser le démarrage : `npm run start:dev` doit fonctionner.
- Respecter les conventions du repo (voir `CODING_RULES.md`) : controllers “minces”, services testables, structure claire.
- Ne pas modifier `TODO.md` (cases inchangées).

## Contexte technique

- Le projet est déjà bootstrap (id01 validé) et possède les fichiers de base :
  - `src/main.ts`
  - `src/app.module.ts`
  - `src/app.controller.ts`
  - `src/app.service.ts`
- Scripts npm disponibles :
  - `npm run start:dev` (lancement en watch)
  - `npm run lint`, `npm run format`, `npm test`, `npm run test:e2e`
- Dépendance `@nestjs/cli` est présente (devDependency). Sur Windows, privilégier `npx nest ...` pour invoquer le binaire local.

Référence slide : `specifications/nestjs-backend-3j/02-demarrage-nestjs/05-demo-nest-cli.yaml`

- Idée clé : montrer le flux CLI → serveur qui répond.

## Étapes (recommandées)

1. Vérifier que l’application démarre avant changement :
   - `npm run start:dev`
   - Appeler l’endpoint de base (`GET /`) et vérifier une réponse (ex: “Hello World!”)
2. Générer un module via Nest CLI (recommandé : `soldes`) :
   - `npx nest g module soldes`
3. Générer un controller associé :
   - `npx nest g controller soldes`
4. Générer un service associé :
   - `npx nest g service soldes`
5. Vérifier le câblage :
   - Si le CLI n’a pas modifié `AppModule`, importer le module généré dans `src/app.module.ts`.
   - Ne pas changer le comportement existant (le `GET /` de `AppController` doit continuer de fonctionner).
6. Vérifier que ça compile et démarre :
   - `npm run start:dev`
7. (Optionnel mais recommandé) Vérifier style/outillage :
   - `npm run lint`
   - `npm run format`

## Cas limites / points d’attention

- Nom de feature : utiliser un nom simple, en minuscules (ex: `soldes`) pour générer des chemins/fichiers conformes aux conventions.
- Windows : si `npx nest` pose problème, utiliser le binaire local : `./node_modules/.bin/nest` (adapté au shell), mais garder `npx` comme option principale.
- Ne pas supprimer ou modifier les fichiers `src/app.*` existants au-delà de l’import module si nécessaire.

## Critères de validation

- Les artefacts générés via CLI sont présents (module + controller + service).
- L’application démarre sans erreur avec `npm run start:dev`.
- Le endpoint existant `GET /` continue de répondre.
- Aucune erreur TypeScript évidente (compilation OK) ; idéalement lint/format passent.

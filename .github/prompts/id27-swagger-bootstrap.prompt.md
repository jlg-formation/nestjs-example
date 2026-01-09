# id27 — Swagger bootstrap

## Role

Tu es un développeur NestJS senior (TypeScript), pragmatique et orienté qualité. Tu suis strictement les conventions du repository (lire `AGENTS.md`, puis `CODING_RULES.md`).

## Objectif

Activer Swagger dans l’application NestJS :

- Swagger UI accessible sur `/api`
- Déclarer l’API key `x-api-key` dans la documentation Swagger

Source : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/19-code-example-swagger-bootstrap.yaml`.

## Format de sortie

Implémentation minimale et claire :

- Ajouter les dépendances Swagger nécessaires dans `package.json` (via commande npm)
- Modifier `src/main.ts` pour initialiser Swagger avec `DocumentBuilder` et `SwaggerModule`

En fin de tâche, mettre à jour `TODO.md` en cochant `[x]` uniquement `id27`.

## Contraintes

- Ne pas ajouter de fonctionnalités bonus (pas d’auto-tagging, pas de decorators Swagger partout si non requis, pas de custom CSS, pas de versioning API).
- Respecter `CODING_RULES.md` : simplicité (KISS), lint, format, tests.
- Ne pas toucher au chapitre `01-typescript-mini-express`.
- Ne cocher `TODO.md` que si les vérifications passent (format/lint/tests). Si blocage, ne pas cocher et décrire le problème.
- Ne pas casser l’API existante (guards, interceptors, format `{ data }`, etc.).

## Contexte technique

- La tâche `id27` dans `TODO.md` référence : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/19-code-example-swagger-bootstrap.yaml`.
- Le codebase ne contient pas encore Swagger (pas de `SwaggerModule` / `DocumentBuilder` dans `src/**`).
- Le guard API key existe déjà (tâche id24) et utilise le header `x-api-key`.
- Le bootstrap Nest est dans `src/main.ts` (pipes/filters globaux déjà en place).

## Étapes

1. Ajouter les dépendances Swagger.
   - Installer `@nestjs/swagger` et `swagger-ui-express`.
   - Vérifier que la compilation TypeScript passe.

2. Modifier `src/main.ts`.
   - Importer `DocumentBuilder` et `SwaggerModule` depuis `@nestjs/swagger`.
   - Créer la configuration Swagger exactement dans l’esprit de la slide :
     - `setTitle('NestJS Backend 3j')`
     - `setDescription('API de démonstration (recharges, réservations, soldes)')`
     - `setVersion('1.0')`
     - `addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey')`
   - Générer le document : `SwaggerModule.createDocument(app, config)`.
   - Exposer l’UI sur `/api` : `SwaggerModule.setup('api', app, document)`.
   - Placer ce setup après `const app = await NestFactory.create(...)` et avant `await app.listen(...)`.

3. Vérifier la doc.
   - L’UI Swagger est accessible sur `http://localhost:<PORT>/api`.
   - La doc expose une sécurité de type `apiKey` nommée `apiKey` avec le header `x-api-key`.

4. Vérifications outillage.
   - `npm run format`
   - `npm run lint`
   - `npm test`
   - `npm run test:e2e`

5. Mettre à jour `TODO.md`.
   - Cocher `[x]` uniquement `id27` si tout est OK.

## Cas limites

- Ne pas modifier le comportement des endpoints (Swagger est documentaire, pas un changement de logique métier).
- Si le port est configurable via `.env`/`process.env.PORT`, Swagger doit rester accessible via le même serveur.
- Ne pas introduire de logs ou de debug inutiles.

## Critères de validation

- Swagger UI accessible sur `/api`.
- `x-api-key` est déclaré dans Swagger via `.addApiKey(..., 'apiKey')`.
- Aucun endpoint existant n’est cassé.
- `npm run format` et `npm run lint` passent.
- `npm test` et `npm run test:e2e` passent.
- `TODO.md` : seule la case `id27` est cochée, rien d’autre.

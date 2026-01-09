# id28 — TP : guard + interceptor (auth + format)

## Role

Tu es un développeur senior NestJS (TypeScript), rigoureux sur la cohérence d’API, la sécurité minimale par clé API, et la qualité (lint + tests). Tu respectes strictement les conventions du repository.

## Objectif

Implémenter (ou finaliser) l’exercice "guard + interceptor" :

- Protéger l’API via un guard `ApiKeyGuard` basé sur le header `x-api-key`.
- Configurer la clé attendue via variable d’environnement.
- Standardiser les réponses _success_ au format `{ data: ... }` via un interceptor `WrapResponseInterceptor` appliqué globalement.

Objectif pédagogique : ajouter ces cross-cutting concerns **sans modifier la logique métier** (services, repositories, règles métiers).

Slide de référence : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/23-exercise-tp-guard-interceptor.yaml`.

## Format de sortie

Livrables attendus (adapter si déjà présent) :

- Un guard : `src/common/guards/api-key.guard.ts`
- Un interceptor : `src/common/interceptors/wrap-response.interceptor.ts`
- Branchement :
  - guard appliqué globalement **ou** sur un controller (choix explicite)
  - interceptor appliqué **globalement** via Nest (`APP_INTERCEPTOR`)
- Configuration : variable d’environnement (ex: `API_KEY`) disponible au runtime et en e2e
- Tests :
  - au minimum un test e2e qui prouve `401` sans `x-api-key`
  - mise à jour des tests existants si le wrapping `{ data }` devient global

Enfin, si et seulement si tout est validé :

- Mettre à jour `TODO.md` en cochant uniquement `id28`.

## Contraintes

- Lire et respecter `AGENTS.md` puis `CODING_RULES.md`.
- Écriture inclusive interdite.
- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Ne pas ajouter de fonctionnalités bonus (rôles, scopes, OAuth, JWT, etc.).
- Ne pas toucher au métier : pas de changement de logique dans les services/repositories (sauf si c’est indispensable pour respecter le contrat HTTP, et dans ce cas le justifier clairement).
- Le header doit être exactement `x-api-key`.
- En cas de clé absente ou invalide : **401 Unauthorized** via `UnauthorizedException`.
- L’interceptor ne doit pas transformer les erreurs/exceptions : il wrap uniquement les réponses success.
- Tant que les tests ou critères ne sont pas OK : ne pas cocher `id28` dans `TODO.md` et décrire le blocage.

## Contexte technique

- Les tâches précédentes ont introduit :
  - un middleware logger,
  - un timing interceptor,
  - Swagger.
- Le repo utilise déjà `ConfigModule.forRoot({ isGlobal: true })` : la variable d’environnement doit être lisible au runtime.
- Important : si un interceptor global est activé, tout ce qui est renvoyé par les controllers devient `{ data: ... }` en HTTP e2e. Les tests doivent refléter ce contrat.

## Étapes

1. Vérifier l’état actuel du code
   - Confirmer si `ApiKeyGuard` et `WrapResponseInterceptor` existent déjà.
   - Repérer où le guard est appliqué (global vs décorateur `@UseGuards`).
   - Repérer si des controllers font déjà un wrapping manuel `{ data: ... }`.

2. Guard (auth)
   - Implémenter ou ajuster `ApiKeyGuard` :
     - lire `x-api-key` sur la requête,
     - comparer à la valeur attendue via variable d’environnement (ex: `API_KEY`),
     - refuser par défaut si la variable est absente.
   - Appliquer le guard :
     - globalement (recommandé) ou sur un controller.

3. Interceptor (format)
   - Implémenter ou ajuster `WrapResponseInterceptor` pour retourner `{ data }`.
   - L’enregistrer globalement (via `APP_INTERCEPTOR`).
   - Éliminer le wrapping manuel dans les controllers (si présent) pour éviter `{ data: { data: ... } }`.

4. Tests
   - Ajouter un test e2e "sans `x-api-key` -> 401".
   - Mettre à jour les autres tests e2e pour envoyer `x-api-key` quand les routes sont protégées.
   - Mettre à jour les asserts e2e pour tenir compte du wrapping `{ data }`.
   - Vérifier les tests unitaires controller : l’interceptor global ne s’exécute pas lors d’un appel direct de méthode.

5. Vérifications locales
   - `npm run format`
   - `npm run lint`
   - `npm test`
   - `npm run test:e2e`

6. Clôture
   - Cocher uniquement `id28` dans `TODO.md`.

## Cas limites

- `API_KEY` non défini : accès refusé (401) pour toutes les routes protégées.
- Header absent, vide, incorrect : 401.
- Éviter tout double wrapping `{ data: { data: ... } }`.

## Exemples (attendus)

- Sans clé :
  - Requête sur une route protégée sans `x-api-key` -> `401 Unauthorized`
- Avec clé :
  - Requête avec `x-api-key: <valeur de API_KEY>` -> status normal (200/201 selon la route)
- Format :
  - Réponse success doit être au format `{ "data": ... }`

## Critères de validation

- [ ] Sans `x-api-key` -> 401.
- [ ] Avec `x-api-key` valide -> accès OK.
- [ ] Réponses success au format `{ data: ... }` sur les endpoints concernés.
- [ ] Les controllers restent fins, sans duplication de wrapping.
- [ ] `npm run format`, `npm run lint`, `npm test`, `npm run test:e2e` passent.
- [ ] `TODO.md` : seule la case `id28` est cochée.

## En cas de blocage

Ne coche pas `id28`. Décris clairement :

- le point bloquant,
- les fichiers concernés,
- le comportement observé (status, body),
- la solution envisagée.

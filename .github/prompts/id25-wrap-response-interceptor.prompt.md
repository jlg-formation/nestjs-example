# id25 — WrapResponseInterceptor (réponse `{ data }`)

## Role

Tu es un expert NestJS (TypeScript) orienté qualité et cohérence d’API (interceptors RxJS, DI Nest, tests unitaires et e2e).

## Objectif

Implémenter un interceptor NestJS `WrapResponseInterceptor` qui transforme toutes les réponses **success** en JSON au format :

- réponse HTTP : `{ "data": <valeur-retournée-par-le-controller> }`

Puis l’appliquer **globalement** à l’application, afin d’éviter la duplication du wrapping dans chaque controller.

## Format de sortie

Modifications attendues dans le codebase (à créer/modifier) :

- `src/common/interceptors/wrap-response.interceptor.ts` (nouveau)
- `src/app.module.ts` (enregistrement global de l’interceptor)
- Ajustements des controllers qui wrap déjà manuellement en `{ data: ... }`
- Ajustements des tests impactés (unitaires controller et e2e)
- Mise à jour de `TODO.md` : cocher `[x]` uniquement `id25` si et seulement si tout est validé

## Contraintes

- Interdiction d’écriture inclusive.
- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, code testable, controllers minces).
- Ne pas ajouter de feature hors périmètre.
- Le wrapping doit concerner uniquement les réponses success : les exceptions ne doivent pas être transformées par l’interceptor.
- L’interceptor doit être appliqué **globalement** via Nest (pas au cas par cas).
- Tant que la tâche n’est pas terminée (tests KO, comportement incomplet, blocage), ne pas cocher `id25` dans `TODO.md`. Décrire clairement le blocage à la place.

## Contexte technique

Slide de référence : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/14-code-example-interceptor-transform.yaml`

Extrait attendu (principe) :

- `next.handle().pipe(map((data) => ({ data })))`

État actuel du projet (points importants) :

- Les pipes/filters globaux sont configurés en test e2e manuellement (ex: `app.useGlobalPipes(...)`, `app.useGlobalFilters(...)`).
- Le guard API key est appliqué globalement via provider Nest dans `AppModule` (pattern à réutiliser) : provider `APP_GUARD`.
- Plusieurs controllers renvoient déjà `{ data: ... }` (risque de double wrapping si on active un interceptor global sans refactor).
- Certains endpoints renvoient des objets simples (ex: `{ ok: true }`) et deviendront `{ data: { ok: true } }` une fois l’interceptor global activé.

Fichiers probablement impactés :

- `src/app.module.ts` (ajouter `APP_INTERCEPTOR`)
- `src/soldes/recharge.controller.ts`
- `src/soldes/reservation.controller.ts`
- `src/soldes/clients.controller.ts`
- Tests unitaires : `src/soldes/recharge.controller.spec.ts` (au minimum)
- Tests e2e : `test/soldes-recharge.e2e-spec.ts` et tout autre test qui assert une réponse non wrappée
- `src/app.controller.ts` + `test/app.e2e-spec.ts` (si le wrapping global change le contrat de `GET /`)

## Étapes

1. Créer l’interceptor
   - Créer `WrapResponseInterceptor` dans `src/common/interceptors/wrap-response.interceptor.ts`.
   - Implémenter `NestInterceptor` avec RxJS `map` pour retourner `{ data }`.

2. L’enregistrer globalement
   - Dans `src/app.module.ts`, enregistrer l’interceptor globalement via `APP_INTERCEPTOR` (comme `APP_GUARD` pour le guard).
   - Vérifier que l’interceptor s’applique aussi aux apps créées en tests e2e avec `moduleFixture.createNestApplication()`.

3. Éliminer la duplication dans les controllers
   - Mettre à jour les controllers qui renvoient déjà `{ data: ... }` pour renvoyer la valeur “nue” (ex: `ClientDto`, `ClientBalanceDto`).
   - Adapter les types de retour TypeScript en conséquence (les controllers ne doivent plus typer `ApiResponse<T>` si l’interceptor s’en charge).

4. Mettre à jour les tests impactés
   - Tests unitaires controller (appel direct de la méthode) : l’interceptor ne s’exécute pas, donc l’assert doit viser la valeur nue.
     - Exemple : `src/soldes/recharge.controller.spec.ts` doit attendre `client` au lieu de `{ data: client }`.
   - Tests e2e : les réponses HTTP doivent maintenant être wrappées.
     - Exemple : `test/soldes-recharge.e2e-spec.ts` attend actuellement `{ ok: true }` ; ce sera `{ data: { ok: true } }` si l’interceptor est global.
   - Vérifier aussi `test/app.e2e-spec.ts` si `GET /` change en `{ data: "Hello World!" }`.

5. Vérifier localement
   - Lancer `npm test` et `npm run test:e2e`.
   - S’assurer qu’aucune réponse success n’est “double-wrappée” (`{ data: { data: ... } }`).

6. Mettre à jour la todo
   - Dans `TODO.md`, cocher `[x]` uniquement la ligne `id25`.

## Cas limites

- Réponse primitive (string/number) : elle doit devenir `{ data: <primitive> }` si l’interceptor est réellement global.
- Exceptions : elles doivent conserver le format d’erreur existant (via exceptions Nest + filter), et ne pas être enveloppées.

## Critères de validation

- `WrapResponseInterceptor` existe et correspond au comportement de la slide.
- L’interceptor est appliqué globalement (et observable en e2e).
- Les controllers ne contiennent plus de wrapping manuel `{ data: ... }` (au moins là où il existait déjà).
- Aucun endpoint success ne renvoie `{ data: { data: ... } }`.
- Tous les tests concernés sont mis à jour et passent : `npm test` et `npm run test:e2e`.
- `TODO.md` est mis à jour en cochant `[x]` uniquement `id25`.

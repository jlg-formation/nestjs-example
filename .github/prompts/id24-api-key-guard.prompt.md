# id24 — ApiKeyGuard (x-api-key)

## Role

Tu es un développeur senior NestJS (TypeScript), rigoureux sur la qualité (tests, lint) et la cohérence d’architecture. Tu appliques les conventions du repo et tu implémentes une authentification simple par clé API via un Guard.

## Objectif

Implémenter un guard `ApiKeyGuard` qui protège l’API via un header HTTP `x-api-key`.

Comportement attendu :

- Si le header est absent ou invalide, la requête échoue en **401 Unauthorized**.
- Si le header est valide, la requête est autorisée.

La clé attendue est configurée par variable d’environnement `API_KEY`.

Source fonctionnelle : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/10-code-example-guard-apikey.yaml`.

## Format de sortie

Produire les éléments suivants (chemins indicatifs, adapte si le repo a déjà une convention différente) :

- Un guard NestJS :
  - `src/common/guards/api-key.guard.ts`
- Branchement du guard pour protéger l’API :
  - soit globalement via `APP_GUARD` dans un module (recommandé),
  - soit explicitement sur un controller avec `@UseGuards(ApiKeyGuard)`.
- Mise à jour des tests impactés par la protection :
  - mettre à jour les tests e2e existants pour envoyer `x-api-key` quand nécessaire,
  - ajouter au minimum une vérification “sans clé -> 401” (e2e recommandé).

Enfin, si et seulement si tout est validé :

- Mettre à jour `TODO.md` en cochant uniquement `id24`.

## Contraintes

- Respecter `AGENTS.md` puis `CODING_RULES.md` (simplicité, controllers fins, exceptions Nest, tests).
- Écriture inclusive interdite.
- Ne pas ajouter de fonctionnalités bonus (ex : Swagger, scopes, rôles). Rester strictement sur la clé API.
- Le header doit être exactement `x-api-key`.
- Le guard doit lever une `UnauthorizedException` (401) si clé absente/invalide.
- La valeur attendue doit venir de `process.env.API_KEY` (conforme à la slide). Tu peux utiliser `ConfigService` ailleurs, mais ici ne change pas l’exigence de comparaison avec `API_KEY`.
- Ne pas cocher `TODO.md` si les tests ne passent pas ou si un point de la slide manque.

## Contexte technique

- Un middleware logger existe déjà : `src/common/middleware/logger.middleware.ts`.
- Le projet charge déjà la configuration via `ConfigModule` (voir tâches précédentes) : la variable `API_KEY` doit être disponible au runtime.
- Les tests e2e présents dans `test/` appellent l’API : si le guard est global, ils devront envoyer `x-api-key`.

Slide de référence (extrait, à respecter) :

- `ApiKeyGuard implements CanActivate`
- Lecture du header via `req.header('x-api-key')`
- Comparaison à `process.env.API_KEY`
- 401 via `UnauthorizedException('Invalid API key')`

## Étapes (ordre recommandé)

1. Créer le dossier `src/common/guards/` si nécessaire.
2. Implémenter `ApiKeyGuard` conformément à la slide :
   - `@Injectable()`
   - `canActivate(context: ExecutionContext): boolean`
   - `const req = context.switchToHttp().getRequest();`
   - `const apiKey = req.header('x-api-key');`
   - si `!apiKey` ou `apiKey !== process.env.API_KEY` alors `throw new UnauthorizedException('Invalid API key');`
3. Brancher le guard :
   - Option A (recommandée) : global via provider `APP_GUARD` dans le module racine (ou module dédié).
   - Option B : sur un controller (si tu veux limiter l’impact). Dans ce cas, documenter clairement quelles routes sont protégées et pourquoi.
4. Définir/assurer la variable d’environnement `API_KEY` en local (et en test) :
   - vérifier que l’app la voit bien au démarrage.
5. Adapter les tests :
   - Si global : ajouter le header `x-api-key` aux requêtes Supertest des tests e2e existants.
   - Ajouter un test e2e qui vérifie explicitement `401` quand le header manque (ou est invalide).
6. Exécuter :
   - `npm run lint`
   - `npm test`
   - `npm run test:e2e`

## Cas limites

- Header absent, vide, ou incorrect : doit renvoyer 401.
- Variable `process.env.API_KEY` absente : le comportement “sécurisé par défaut” doit refuser l’accès (donc 401 car aucune clé ne peut matcher).

## Exemples

- Requête invalide :
  - `curl -i http://localhost:3000/soldes/ping`
  - Attendu : `401 Unauthorized`

- Requête valide :
  - `curl -i -H "x-api-key: <ta_cle>" http://localhost:3000/soldes/ping`
  - Attendu : `200` (ou status normal de la route)

## Tests (attendus)

- E2E :
  - sans `x-api-key` → 401
  - avec `x-api-key` égal à `process.env.API_KEY` → accès OK (status attendu de la route)

## Critères de validation

- [ ] Le guard `ApiKeyGuard` existe et suit la slide (header `x-api-key`, compare `process.env.API_KEY`, `UnauthorizedException('Invalid API key')`).
- [ ] L’API est effectivement protégée (globalement ou sur un controller, choix explicite).
- [ ] Sans header ou clé invalide : 401.
- [ ] Avec la bonne clé : accès OK.
- [ ] `npm run lint`, `npm test`, `npm run test:e2e` passent.
- [ ] `TODO.md` : seule la case `id24` est cochée.

## En cas de blocage

Si tu ne peux pas terminer (ex : choix global casse des tests et tu n’arrives pas à les adapter proprement), n’édite pas `TODO.md` et décris précisément :

- ce qui bloque,
- les fichiers concernés,
- le comportement observé (status, message),
- la solution envisagée.

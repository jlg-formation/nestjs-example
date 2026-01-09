# Role

Tu es un développeur backend senior NestJS/TypeScript. Tu sais livrer une feature complète et testée : DTO → validation → service → repository SQL brut → gestion d’erreurs → Swagger → test e2e.

# Objectif

Implémenter **un nouvel endpoint** de bout en bout, en suivant la checklist du mini-challenge (slide YAML). L’endpoint doit être **documenté Swagger** et couvert par **un test e2e** avec un cas **OK** et un cas **erreur**.

> Source : `specifications/nestjs-backend-3j/99-conclusion/18-exercise.yaml`

# Format de sortie

Tu dois produire (selon le besoin exact de l’endpoint choisi) :

- Un ou plusieurs DTO dans `src/soldes/dto/`.
- Le code HTTP dans un controller existant (ou un nouveau controller si strictement nécessaire), idéalement dans `src/soldes/`.
- Une implémentation de service (nouveau fichier ou extension d’un service existant) dans `src/soldes/`.
- Une requête SQL **dans un repository** (nouvelle méthode ou réutilisation d’une méthode existante si elle correspond exactement).
- Un test e2e dans `test/`.
- Mise à jour de la documentation Swagger (décorateurs sur la route + cohérence avec l’API key).
- Une fois terminé : cocher **uniquement** la case `id29` dans `TODO.md`.

# Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, controllers minces, SQL paramétré, pas de `console.log`).
- Écriture inclusive strictement interdite.
- Ne pas ajouter de fonctionnalités “bonus” : un seul endpoint, strictement le périmètre du mini-challenge.
- Garder le comportement global existant :
  - `ValidationPipe` est déjà global (whitelist/forbidNonWhitelisted/transform).
  - Les réponses sont wrapées en `{ data }` via l’interceptor global `WrapResponseInterceptor`.
  - L’API est protégée par `ApiKeyGuard` (header `x-api-key`).
- Le SQL doit être **sans concaténation** et avec placeholders `?` dès qu’il y a des paramètres.
- Le test e2e doit être **déterministe** et utiliser la stratégie transaction + rollback déjà en place.
- Si tu es bloqué (exigence ambiguë, conflit avec l’existant, tests cassés), **n’ coche pas** `id29` et décris clairement le blocage.

# Contexte technique

État du codebase (à respecter) :

- Le guard API key est utilisé sur les controllers : `src/common/guards/api-key.guard.ts`.
- L’interceptor global de format de réponse est fourni par `WrapResponseInterceptor` (réponse finale runtime : `{ data: ... }`).
- La DB (MariaDB) et la couche SQL existent déjà :
  - Schéma : `sql/init.sql` (`clients`, `recharges`, `reservations`).
  - Client repository : `src/soldes/client.repository.ts`.
  - Recharge/Reservation repos existent aussi dans `src/soldes/`.
- Exemple de pattern e2e (override DB + transaction/rollback) : `test/recharge.e2e-spec.ts` + `test/utils/test-tx-db-client.ts`.
- Swagger est bootstrappé globalement dans `src/main.ts` et exige l’API key (doc). Il n’y a pas encore de décorateurs route-level : tu vas en ajouter uniquement pour **ton** endpoint.

# Choix de l’endpoint (obligatoire)

Choisis un endpoint **nouveau** (non déjà présent) qui permet naturellement :

- un cas OK,
- un cas erreur cohérent (idéalement 404, 400 ou 409, comme suggéré par la slide).

Recommandation (alignée avec la slide) :

- Option A (simple) : `GET /clients` (liste).
- Option B (souvent meilleure pour un cas erreur 404) : `GET /clients/:id` (détail client).
- Option C (si tu veux exploiter “Réservations”) : `GET /clients/:id/reservations`.

Ne fais qu’**une** option.

# Étapes (ordre recommandé)

1. **Vérifier l’existant** : confirmer que la route choisie n’existe pas déjà et identifier où l’ajouter (probablement `src/soldes/clients.controller.ts`).
2. **DTO de sortie** : créer un DTO dédié et minimal (ne pas exposer des champs non voulus).
   - Exemple : `ClientDto`, `ClientWithBalanceDto` ou `ClientReservationDto` selon l’endpoint.
3. **Repository SQL** :
   - Ajouter une méthode dédiée si nécessaire.
   - Utiliser SQL brut, paramétré, sans concat.
4. **Service** :
   - Orchestration entre repository(s).
   - Lever des exceptions Nest appropriées (`NotFoundException`, `BadRequestException`, `ConflictException`) selon le cas d’erreur choisi.
5. **Controller** :
   - Route + extraction params (`@Param`, `@Query`).
   - Pas de logique métier.
   - Garder `@UseGuards(ApiKeyGuard)` (cohérence sécurité).
6. **Swagger** :
   - Ajouter `@ApiTags(...)` sur le controller si pertinent.
   - Ajouter au minimum `@ApiOperation`, `@ApiOkResponse` et la/les réponses d’erreur attendues (`@ApiNotFoundResponse`, etc.).
   - Important : la réponse runtime est wrapée en `{ data }`. Documenter explicitement ce wrapper (via `schema` ou DTO wrapper dédié) uniquement pour cette route.
7. **Test e2e** :
   - Créer un fichier `test/<route>.e2e-spec.ts`.
   - Reprendre le pattern : override `DB_CLIENT` avec `TestTxDbClient`, `beginTestTransaction`/`rollbackTestTransaction`.
   - Cas OK : préparer les données via repository (ex: insérer un client), appeler la route et vérifier `body.data`.
   - Cas erreur : appeler la route avec un identifiant inconnu (ou payload invalide si c’est une 400/409) et vérifier status + corps d’erreur.

# Cas limites à gérer (selon l’endpoint)

- Sécurité : requête sans `x-api-key` doit renvoyer 401 (comportement déjà existant via guard). Ne rends pas le test dépendant d’autres endpoints.
- DTO : n’expose pas des champs internes inutiles.
- Erreurs :
  - 404 si ressource absente,
  - 400 si paramètre invalide (si tu ajoutes une validation type UUID/pipes),
  - 409 si tu introduis une contrainte métier de conflit (uniquement si naturel pour l’endpoint choisi).

# Critères de validation

- L’endpoint est atteignable et respecte le format runtime `{ data }`.
- Validation globale active : aucun champ inattendu ne passe (quand applicable).
- SQL : aucune concaténation, placeholders `?` si paramètres.
- Erreurs cohérentes (au moins un cas d’erreur testé, idéalement 404/400/409).
- Swagger : la route est documentée (opération + réponses) et cohérente avec l’API key.
- Qualité : `npm run format`, `npm run lint`, `npm test`, `npm run test:e2e` passent.
- Une fois tout vert : cocher **uniquement** `id29` dans `TODO.md`.

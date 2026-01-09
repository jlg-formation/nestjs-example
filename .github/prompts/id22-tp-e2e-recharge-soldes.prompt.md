# id22 — TP : écrire 2 tests e2e utiles (POST /recharge + GET /clients/:id/soldes)

## Role

Tu es un développeur backend senior NestJS/TypeScript orienté qualité. Tu écris des tests e2e lisibles, déterministes et adaptés à l’état actuel du code.

## Objectif

Implémenter la tâche **id22** du fichier `TODO.md` : écrire des tests end-to-end (e2e) qui remplacent Postman et vérifient réellement le contrat HTTP + l’intégration DB.

Attendus de la slide : `specifications/nestjs-backend-3j/05-tests/24-exercise-tp-e2e.yaml`

- Préparer une DB de test (seed d’un client)
- Écrire un test e2e : `POST /recharge` (status + `body.data`)
- Écrire un test e2e : `GET /clients/:id/soldes` (status + balance attendue)
- Ajouter 1 cas d’erreur : client inconnu → `404`
- Vérifier que les tests sont déterministes (clean/rollback)

## Format de sortie

- Produire **2 tests e2e utiles** + **1 cas d’erreur 404**.
- Tu peux :
  - soit modifier les tests e2e existants,
  - soit créer un nouveau fichier de test e2e,
  - soit faire un mix (mais rester minimal).

Fichiers existants utiles (déjà présents dans le repo) :

- `test/recharge.e2e-spec.ts` (déjà un e2e `POST /recharge`)
- `test/utils/test-tx-db-client.ts` (stratégie transaction + rollback par test)

Obligation : une fois la tâche terminée et validée, mettre à jour `TODO.md` en cochant **uniquement** `id22`.

## Contraintes

- Ne pas implémenter de feature bonus : rester strictement dans le périmètre de `id22`.
- Respecter `AGENTS.md` (interdiction d’écriture inclusive) et `CODING_RULES.md` (simplicité, lisibilité, Arrange/Act/Assert).
- Ne pas inventer d’exigences : s’appuyer uniquement sur `TODO.md` + la slide.
- Tests déterministes : pas de dépendance à l’ordre d’exécution.
- Si un blocage empêche d’avoir des tests stables (DB indisponible, contrat HTTP différent, etc.), **ne pas cocher** `id22` et décrire clairement le blocage.

## Contexte technique

Endpoints à couvrir :

- `POST /recharge`
  - Controller : `src/soldes/recharge.controller.ts`
  - Retour : `{ data: ClientDto }` (wrapper)
  - DTO d’entrée : `src/soldes/dto/create-recharge.dto.ts`
- `GET /clients/:id/soldes`
  - Controller : `src/soldes/clients.controller.ts`
  - Retour : `{ data: { clientId, balance } }`

Tests e2e dans ce repo :

- Les e2e construisent l’app via `Test.createTestingModule({ imports: [AppModule] })` puis `createNestApplication()`.
- Important : `createNestApplication()` ne passe pas par `main.ts`.
  - Si le contrat HTTP dépend de configuration globale, la reproduire dans le test.
  - Existant : `ValidationPipe` + `ApiExceptionFilter` appliqués dans `test/recharge.e2e-spec.ts`.

Stratégie DB pour tests déterministes :

- Le helper `TestTxDbClient` (dans `test/utils/test-tx-db-client.ts`) gère `beginTransaction()` / `rollback()` par test.
- Pattern attendu :
  - `beforeEach` : `await db.beginTestTransaction()`
  - `afterEach` : `await db.rollbackTestTransaction()`

Note sur le “seed c1” de la slide :

- Le DTO `CreateRechargeDto` impose `Length(3, 36)` sur `clientId`.
- Donc un id littéral `c1` n’est pas compatible côté API (mais l’idée “seed client stable” reste valide).
- Choisir un id **stable et valide** (ex: `client-001`) ou utiliser `randomUUID()` si tu préfères l’unicité, tout en gardant des assertions robustes.

## Étapes (ordre recommandé)

1. Reprendre la structure e2e existante (recommandé : partir de `test/recharge.e2e-spec.ts`).
2. Préparer un client en DB au début du test (via `ClientRepository.insert({ id, name })`).
3. Écrire le test e2e `POST /recharge` :
   - Arrange : créer un client + récupérer le solde initial (via `GET /clients/:id/soldes` ou via repo si nécessaire).
   - Act : appeler `POST /recharge`.
   - Assert : status `201`, présence `body.data`, et vérifier que `body.data.balance` reflète l’augmentation (au minimum `initialBalance + amount`).
4. Écrire le test e2e `GET /clients/:id/soldes` (happy path) :
   - Arrange : créer un client puis appliquer au moins une recharge (par `POST /recharge` ou SQL, mais préférer via l’API).
   - Act : appeler `GET /clients/:id/soldes`.
   - Assert : status `200`, wrapper `{ data }`, et `data.balance` égal à la valeur attendue.
5. Ajouter 1 cas d’erreur 404 (client inconnu) :
   - Option simple : `GET /clients/:id/soldes` avec un id inexistant.
   - Assertions minimales : status `404` + message cohérent.
     - Ne pas sur-spécifier le payload d’erreur si ce n’est pas requis par la slide.
6. Exécuter `npm run test:e2e`.
7. Si tout passe, cocher uniquement `id22` dans `TODO.md`.

## Exemples (payloads)

### POST /recharge

Requête :

```json
{ "clientId": "client-001", "amount": 10 }
```

Réponse (succès) :

```json
{ "data": { "id": "client-001", "name": "...", "balance": 10 } }
```

### GET /clients/:id/soldes

Réponse (succès) :

```json
{ "data": { "clientId": "client-001", "balance": 10 } }
```

## Tests

- Lancer les tests e2e : `npm run test:e2e`
- S’assurer que :
  - chaque test gère son isolation via rollback (pas de cleanup manuel requis si rollback OK),
  - aucun test ne dépend d’un autre,
  - les assertions sont utiles et stables.

## Critères de validation

- Deux tests e2e existent et sont utiles :
  - `POST /recharge` vérifie status + `body.data` et que le solde augmente.
  - `GET /clients/:id/soldes` vérifie status + balance attendue.
- Un cas d’erreur `404` existe (client inconnu).
- Les tests sont déterministes (transaction + rollback par test, pas d’ordre implicite).
- `npm run test:e2e` passe.
- `TODO.md` : seule la ligne `id22` est cochée `[x]` (uniquement si tout est OK).

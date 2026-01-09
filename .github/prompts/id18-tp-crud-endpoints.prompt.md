````markdown
# Role

Tu es un développeur backend senior spécialisé en NestJS (TypeScript), orienté architecture propre (controller/service/repository), SQL paramétré, transactions, validation DTO, et contrat HTTP stable.

# Objectif

Livrer le TP `id18` : **implémenter 3 endpoints cohérents** en respectant le contrat `{ data: ... }` et une architecture claire.

Endpoints attendus :

- **POST `/recharge`**
- **POST `/reservation`**
- **GET `/clients/:id/soldes`**

La slide de référence est : `specifications/nestjs-backend-3j/04-crud-architecture/23-exercise-tp-crud.yaml`.

# Format de sortie

Modifications attendues (à créer/modifier selon l’état du code) :

- DTOs
  - `src/soldes/dto/create-recharge.dto.ts` (déjà présent) : utilisé par POST `/recharge`
  - `src/soldes/dto/create-reservation.dto.ts` : à créer
  - `src/soldes/dto/client-balance.dto.ts` (déjà présent) : utilisé par GET `/clients/:id/soldes`
- Controllers
  - `src/soldes/recharge.controller.ts` (déjà présent) : POST `/recharge`
  - `src/soldes/reservation.controller.ts` : à créer (POST `/reservation`)
  - `src/soldes/clients.controller.ts` (déjà présent) : GET `/clients/:id/soldes`
- Services
  - `src/soldes/recharge.service.ts` (déjà présent)
  - `src/soldes/reservation.service.ts` : à créer
  - `src/soldes/soldes.service.ts` (déjà présent)
- Repositories (SQL brut)
  - `src/soldes/recharge.repository.ts` (déjà présent)
  - `src/soldes/reservation.repository.ts` : à créer
  - `src/soldes/client.repository.ts` (déjà présent)
- Wiring Nest
  - `src/soldes/soldes.module.ts` : ajouter le controller/service/repository de réservation

⚠️ Ne modifier **aucun autre fichier** que ceux nécessaires à `id18`, sauf si c’est indispensable pour compiler/linter/tester.

# Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md`.
- Écriture inclusive strictement interdite.
- Ne pas ajouter de "bonus" (pas de Swagger, pas d’interceptor global, pas de nouveaux endpoints hors scope).
- Controllers minces :
  - pas de SQL dans les controllers,
  - pas de logique métier (solde suffisant, 404, etc.) dans les controllers.
- Réponses HTTP : format explicite `{ data: ... }` (ne pas dépendre d’un interceptor global ; `id25` n’est pas fait).
- SQL : uniquement des requêtes **paramétrées** (placeholders `?`).
- Transaction obligatoire pour les opérations multi-requêtes (réservation et recharge).
- Si blocage (exigences manquantes, incohérence), **ne pas cocher** `id18` dans `TODO.md` et décrire précisément le blocage.

# Contexte technique

## Références slides

- Exigences TP : `specifications/nestjs-backend-3j/04-crud-architecture/23-exercise-tp-crud.yaml`
- DTO réservation (format + validations) : `specifications/nestjs-backend-3j/04-crud-architecture/06-code-example-reservation-dto.yaml`
- SQL réservation (UPDATE conditionnel + INSERT historique) : `specifications/nestjs-backend-3j/04-crud-architecture/12-code-example-sql-insert-reservation.yaml`
- Contrat GET soldes : `specifications/nestjs-backend-3j/04-crud-architecture/21-code-example-get-balance.yaml`
- Contrat POST recharge : `specifications/nestjs-backend-3j/04-crud-architecture/18-code-example-controller-post-recharge.yaml`

## État actuel du code (à respecter)

- Type de réponse standard : `src/common/dto/api-response.ts` (`ApiResponse<T> = { data: T; meta?: ... }`).
- Endpoints déjà présents :
  - POST `/recharge` : `src/soldes/recharge.controller.ts`
  - GET `/clients/:id/soldes` : `src/soldes/clients.controller.ts`
- Transaction déjà utilisée (pattern) : `src/soldes/recharge.repository.ts` via `db.createTransaction()`.
- DB schema : `sql/init.sql` (tables `clients`, `recharges`, `reservations`).

# Étapes (ordre recommandé)

1. Confirmer l’existant : POST `/recharge` et GET `/clients/:id/soldes` respectent bien `{ data: ... }` et utilisent DTO/Service/Repository (pas de SQL controller).
2. Créer le DTO `CreateReservationDto` selon la slide `06-code-example-reservation-dto.yaml` :
   - `clientId: string` avec `@IsString()` + `@Length(3, 36)`
   - `reference: string` avec `@IsString()` + `@Length(3, 40)`
   - `amount: number` avec `@IsInt()` + `@IsPositive()`
3. Créer `ReservationController` avec **POST `/reservation`** :
   - `@Body() dto: CreateReservationDto`
   - retour `Promise<ApiResponse<ClientDto>>` (même contrat que recharge : renvoyer le client mis à jour `{ id, name, balance }`)
4. Implémenter `ReservationService` :
   - vérifier l’existence du client (sinon `NotFoundException('Client not found')`)
   - appliquer la réservation via `ReservationRepository`
   - si solde insuffisant : lever une exception HTTP (par exemple `BadRequestException('Insufficient funds')`) ; garder une erreur claire.
5. Implémenter `ReservationRepository` (SQL brut + transaction) :
   - transaction `begin/commit/rollback/release`
   - UPDATE conditionnel (pattern slide) :
     - `UPDATE clients SET balance = balance - ? WHERE id = ? AND balance >= ?`
     - si `affectedRows !== 1` : signaler "fonds insuffisants" (sans créer de réservation)
   - INSERT historique :
     - `INSERT INTO reservations (client_id, reference, amount) VALUES (?, ?, ?)`
   - SELECT client (id, name, balance) pour retourner un `ClientDto` cohérent.
6. Câbler dans `SoldesModule` : ajouter controller/service/repository de réservation.
7. Vérifier compilation + lint + tests.

# Cas limites

- Client absent :
  - POST `/reservation` et POST `/recharge` doivent renvoyer **404** (`NotFoundException('Client not found')`).
- Solde insuffisant :
  - POST `/reservation` doit refuser la demande (erreur HTTP) et ne pas créer de ligne dans `reservations`.
- Validation :
  - `amount <= 0` doit être rejeté via validation (400).
  - `clientId` ou `reference` trop courts/longs doivent être rejetés via validation.

# Exemples

## POST /reservation

Requête :

```json
{ "clientId": "cli_123", "reference": "order_456", "amount": 10 }
```

Réponse 200 :

```json
{ "data": { "id": "cli_123", "name": "Alice", "balance": 32 } }
```

Réponse solde insuffisant : statut HTTP 400 (ou autre statut cohérent), avec un message exploitable.

## GET /clients/:id/soldes

Réponse 200 :

```json
{ "data": { "clientId": "cli_123", "balance": 42 } }
```

# Tests / Vérifications

- Lancer `npm run lint`.
- Lancer `npm test`.
- Si e2e déjà en place et rapides : `npm run test:e2e`.

Ne pas corriger des tests non liés au scope.

# Critères de validation

- [ ] Les 3 endpoints existent : POST `/recharge`, POST `/reservation`, GET `/clients/:id/soldes`.
- [ ] Chaque endpoint renvoie une réponse au format `{ data: ... }` via `ApiResponse<T>`.
- [ ] `CreateReservationDto` est créé et validé (class-validator) selon la slide.
- [ ] POST `/reservation` applique la règle "solde suffisant" et n’écrit pas d’historique en cas d’échec.
- [ ] POST `/reservation` renvoie 404 si le client n’existe pas.
- [ ] Les repositories contiennent le SQL (paramétré) et les controllers n’ont pas de SQL.
- [ ] Transaction utilisée pour recharge et réservation.
- [ ] `npm run lint` passe.
- [ ] Les tests existants passent.
- [ ] Une fois terminé et validé : cocher **uniquement** `id18` dans `TODO.md` (`[x]`).
````

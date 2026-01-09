# id13 — TP : service SQL brut + DTO validé

## Role

Vous êtes un développeur backend senior spécialisé en NestJS (TypeScript), rigoureux sur la séparation controller/service/repository, la validation (class-validator) et l’accès SQL paramétré.

## Objectif

Implémenter un endpoint NestJS complet « de bout en bout » qui :

- reçoit un payload JSON validé via DTO (contraintes de type + bornes),
- applique la validation automatiquement (ValidationPipe global ou sur la route),
- exécute un **SELECT** puis un **INSERT** via SQL brut **paramétré** (placeholders `?`),
- orchestre la logique dans un service `@Injectable()` (controller mince),
- renvoie des erreurs **cohérentes** et une **400 lisible** lorsque le payload est invalide.

Source des exigences (slide) : `specifications/nestjs-backend-3j/03-validation-sql-services/22-exercise-tp-sql-service.yaml`.

## Format de sortie

Modifier / ajouter uniquement ce qui est nécessaire pour livrer l’exercice.

Livrables attendus :

- Un endpoint HTTP fonctionnel qui **écrit en base**.
- Un repository SQL brut dédié (SELECT + INSERT) injectable.
- Un service `@Injectable()` qui orchestre la logique en s’appuyant sur le repository.
- Un ou des tests qui couvrent :
  - un cas valide,
  - au moins un cas invalide renvoyant une 400 « lisible » (corps JSON stable).

## Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter les conventions du dépôt : lire et suivre `AGENTS.md` puis `CODING_RULES.md`.
- SQL : **interdiction** de concaténer des valeurs dans la chaîne SQL. Utiliser uniquement des requêtes paramétrées.
- Architecture : repository séparé du service ; controller mince.
- Validation : le DTO doit exprimer des contraintes (types + bornes) et la validation doit être effectivement appliquée (globalement ou sur la route).
- Erreurs : format stable (cohérent) ; 400 lisible en cas de payload invalide.
- Tests : exécuter la suite pertinente (`npm test` et/ou `npm run test:e2e`) selon le type de tests ajoutés.
- Mise à jour TODO : à la toute fin, **uniquement si tout est validé**, cocher `[x]` pour la tâche `id13` dans `TODO.md`.
  - Si blocage / exigences manquantes / tests KO : **interdiction de cocher** et documenter clairement le blocage.

## Contexte technique

État actuel (à utiliser, ne pas réinventer) :

- Validation globale déjà active dans `src/main.ts` via `ValidationPipe` (whitelist/forbidNonWhitelisted/transform).
- Filtre d’exception global déjà en place : `src/common/filters/api-exception.filter.ts` (format `{ statusCode, message, errorCode }`).
- Couche DB fournie :
  - `src/db/mysql-db-client.ts` implémente `DbClient` (mysql2/promise).
  - `src/db/db.module.ts` fournit le token `DB_CLIENT`.
- Exemple de repository SQL brut existant : `src/soldes/client.repository.ts` (SELECT + INSERT paramétrés).
- Endpoint existant : `POST /soldes/recharge` dans `src/soldes/soldes.controller.ts`.
- DTO existant : `src/soldes/dto/create-recharge.dto.ts` (contraintes sur `clientId` et `amount`).

Schéma SQL (utile pour le TP) : `sql/init.sql` contient les tables `clients` et `recharges`.

## Étapes (recommandées)

1. Choisir l’endpoint cible
   - Option par défaut (recommandée car déjà en place) : compléter `POST /soldes/recharge` pour **écrire** dans `recharges`.
   - Conserver le périmètre du TP : **SELECT + INSERT** (pas de transaction complète ni d’UPDATE de balance à ce stade, sauf si déjà requis par le code existant).

2. DTO et validation
   - Réutiliser `CreateRechargeDto` si ses contraintes suffisent à « types + bornes ».
   - Sinon, l’ajuster minimalement (sans changer inutilement l’API).
   - Vérifier que la validation s’exécute réellement via le `ValidationPipe` global (éviter la duplication inutile de pipes locaux, sauf justification).

3. Repository SQL brut (SELECT + INSERT)
   - Créer un repository dédié pour les recharges (ex: `RechargeRepository` ou `RechargesRepository`).
   - Implémenter :
     - un `SELECT` (par ex. vérifier l’existence du client via `clients`),
     - un `INSERT` dans `recharges`.
   - Utiliser le pattern de `ClientRepository` : injection `@Inject(DB_CLIENT)` et `db.query(sql, params)`.

4. Service `@Injectable()`
   - Déplacer la logique de la route dans le service.
   - Orchestrer l’appel : validation (déjà faite par pipe) → SELECT → INSERT.
   - Pour la gestion d’erreur « métier » minimale :
     - si le client n’existe pas, lever une exception Nest (par défaut `BadRequestException`) afin de rester cohérent avec l’objectif « 400 lisible » (la gestion 404 est traitée plus tard dans le cours).

5. Erreurs cohérentes et 400 lisible
   - Vérifier le rendu actuel des erreurs de validation via le filtre global `ApiExceptionFilter`.
   - Si le message est trop générique (ex: “Bad Request Exception”), adapter **sans changer le format global** :
     - conserver `{ statusCode, message, errorCode }`,
     - rendre `message` réellement informatif pour les erreurs de validation (extraction de `exception.getResponse()` si c’est un objet avec `message` tableau, par exemple).

6. Tests
   - Ajouter un test qui prouve :
     - cas valide : statut 2xx (et insertion effective si test intégration/e2e),
     - cas invalide : statut 400 + corps JSON au format stable, avec un `message` lisible.
   - Recommandation : faire un test e2e minimal (Supertest) pour réellement exercer `ValidationPipe` + `ApiExceptionFilter`.
   - Si le test écrit en DB, prévoir un nettoyage (DELETE) en fin de test (pattern présent dans `test/mariadb.e2e-spec.ts`).

## Cas limites à couvrir (minimum)

- Payload invalide :
  - champ manquant (ex: `amount` absent),
  - type incorrect (ex: `amount` string),
  - bornes (ex: `amount <= 0`).
- Client inexistant :
  - réponse cohérente (par défaut 400 avec message explicite).

## Exemples (indicatifs)

Requête valide (exemple) :

- `POST /soldes/recharge`
- Body :
  ```json
  {
    "clientId": "9f0b7d7e-2d45-4a6f-8c02-0a0c1fcbf5d1",
    "amount": 100
  }
  ```

Réponse erreur (format stable requis) :

```json
{
  "statusCode": 400,
  "message": "amount must be a positive number",
  "errorCode": "BAD_REQUEST"
}
```

## Critères de validation

- Le endpoint choisi écrit effectivement en base (INSERT observé) et le SQL est paramétré.
- Le code respecte la séparation controller/service/repository et s’intègre aux modules existants.
- Le DTO impose des contraintes (types + bornes) et la validation est appliquée automatiquement.
- Les erreurs sont cohérentes (format stable) et la 400 est lisible pour les payloads invalides.
- Les tests ajoutés passent localement.
- `TODO.md` : la case `id13` est cochée **uniquement** si tout est OK.

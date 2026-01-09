# TODO — NestJS Backend (correction progressive)

Cette todo-list transforme les slides YAML dans `specifications/` en tâches de développement **NestJS**.
Contrainte : **ne pas inclure** le chapitre `01-typescript-mini-express`.
Règle : **1 commit = 1 tâche cochée**.

Chaque tâche contient :

- l’intention (ce qu’on apprend / prouve),
- le livrable attendu (endpoint, module, test, config),
- la slide source (traçabilité).

## 02-demarrage-nestjs

- [x] id01 Bootstrapper le projet NestJS (structure + scripts) — Intention: démarrer une app Nest standard ; Livrable: app qui démarre en dev (specifications/nestjs-backend-3j/02-demarrage-nestjs/04-process-bootstrap-projet.yaml)
- [x] id02 Utiliser Nest CLI pour générer du code (module/controller/service) — Intention: pratiquer l’outillage ; Livrable: génération via CLI sans casser le démarrage (specifications/nestjs-backend-3j/02-demarrage-nestjs/05-demo-nest-cli.yaml)
- [x] id03 Créer un controller minimal avec `@Controller/@Get/@Post` — Intention: comprendre le routing Nest ; Livrable: routes `GET /soldes/ping` + `POST /soldes/recharge` (specifications/nestjs-backend-3j/02-demarrage-nestjs/09-code-example-controller-get-post.yaml)
- [x] id04 Créer un service `@Injectable()` pour la logique métier — Intention: séparer HTTP et métier ; Livrable: `SoldesService.getBalance(clientId)` (specifications/nestjs-backend-3j/02-demarrage-nestjs/11-code-example-service-injectable.yaml)
- [x] id05 Injecter le service dans un controller — Intention: pratiquer la DI ; Livrable: route `GET /clients/:id/soldes` qui délègue au service (specifications/nestjs-backend-3j/02-demarrage-nestjs/13-code-example-controller-inject-service.yaml)
- [x] id06 Déclarer controllers/providers dans un module dédié — Intention: comprendre l’assemblage ; Livrable: `SoldesModule` câblé (specifications/nestjs-backend-3j/02-demarrage-nestjs/14-code-example-module-wire.yaml)
- [x] id07 TP : créer le module Soldes (controller fin + service) — Intention: livrer une première feature Nest propre ; Livrable: module Soldes opérationnel + route GET en JSON (specifications/nestjs-backend-3j/02-demarrage-nestjs/18-exercise-tp-soldes.yaml)

## 03-validation-sql-services

- [x] id08 Charger `.env` avec `ConfigModule` et injecter `ConfigService` — Intention: centraliser la config ; Livrable: `ConfigModule.forRoot({ isGlobal: true })` + usage `config.get()` (specifications/nestjs-backend-3j/03-validation-sql-services/06-code-example-configservice.yaml)
- [x] id09 Créer un DTO d’entrée validé avec `class-validator` — Intention: refuser les payloads invalides ; Livrable: DTO (ex: `CreateRechargeDto`) avec contraintes (specifications/nestjs-backend-3j/03-validation-sql-services/09-code-example-dto-validation.yaml)
- [x] id10 Activer `ValidationPipe` global (whitelist/forbid/transform) — Intention: rendre l’API stricte par défaut ; Livrable: config dans `main.ts` + 400 sur champs inattendus (specifications/nestjs-backend-3j/03-validation-sql-services/11-code-example-main-validationpipe.yaml)
- [x] id11 Créer un repository SQL brut injectable (SELECT + INSERT paramétrés) — Intention: isoler le SQL ; Livrable: repository avec placeholders `?` (specifications/nestjs-backend-3j/03-validation-sql-services/18-code-example-sql-repository.yaml)
- [x] id12 Centraliser les erreurs avec un Exception Filter — Intention: format d’erreur stable ; Livrable: `ApiExceptionFilter` qui renvoie un JSON cohérent (specifications/nestjs-backend-3j/03-validation-sql-services/15-code-example-exception-filter.yaml)
- [x] id13 TP : service SQL brut + DTO validé — Intention: construire un endpoint complet (DTO → validation → service → repo → erreurs) ; Livrable: endpoint qui écrit en DB + 400 lisibles sur payload invalide (specifications/nestjs-backend-3j/03-validation-sql-services/22-exercise-tp-sql-service.yaml)

## 04-crud-architecture

- [x] id14 Implémenter `POST /recharge` (controller fin + réponse `{ data }`) — Intention: stabiliser le contrat HTTP ; Livrable: controller + DTO d’entrée (specifications/nestjs-backend-3j/04-crud-architecture/18-code-example-controller-post-recharge.yaml)
- [x] id15 Implémenter `RechargeService` (métier + 404 si client absent) — Intention: mapper métier → exceptions Nest ; Livrable: service injectable qui lève `NotFoundException` (specifications/nestjs-backend-3j/04-crud-architecture/19-code-example-service-recharge.yaml)
- [x] id16 Implémenter `RechargeRepository` avec transaction (INSERT + UPDATE + SELECT) — Intention: encapsuler SQL + transaction ; Livrable: begin/commit/rollback + SQL paramétré (specifications/nestjs-backend-3j/04-crud-architecture/20-code-example-repository-recharge.yaml)
- [x] id17 Implémenter `GET /clients/:id/soldes` avec DTO de sortie dédié — Intention: éviter de sur-exposer des champs ; Livrable: `ClientBalanceDto` + 404 si absent + `{ data }` (specifications/nestjs-backend-3j/04-crud-architecture/21-code-example-get-balance.yaml)
- [x] id18 TP : livrer les endpoints CRUD (recharge, reservation, soldes) — Intention: assembler controller/service/repository ; Livrable: 3 endpoints cohérents + SQL paramétré + transaction (specifications/nestjs-backend-3j/04-crud-architecture/23-exercise-tp-crud.yaml)

## 05-tests

- [x] id19 Tester un controller via `TestingModule` avec service mocké — Intention: tester le contrat sans DB ; Livrable: test unitaire controller + `useValue` (specifications/nestjs-backend-3j/05-tests/10-code-example-testing-module.yaml)
- [x] id20 Écrire un test e2e avec Supertest sur `POST /recharge` — Intention: vérifier le contrat HTTP en intégration ; Livrable: e2e qui assert status + `body.data` (specifications/nestjs-backend-3j/05-tests/14-code-example-e2e-supertest.yaml)
- [x] id21 Mettre en place une stratégie “transaction + rollback par test” — Intention: tests déterministes ; Livrable: hooks `beforeEach/afterEach` avec rollback (specifications/nestjs-backend-3j/05-tests/19-code-example-transaction-rollback.yaml)
- [x] id22 TP : écrire 2 tests e2e utiles — Intention: remplacer Postman par la CI ; Livrable: e2e `POST /recharge` + e2e `GET /clients/:id/soldes` + cas 404, stables (specifications/nestjs-backend-3j/05-tests/24-exercise-tp-e2e.yaml)

## 06-middleware-guards-interceptors-swagger

- [x] id23 Ajouter un middleware logger (method + URL + status + durée) — Intention: observabilité simple ; Livrable: `LoggerMiddleware` branché sur l’app (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/06-code-example-middleware-logger.yaml)
- [x] id24 Ajouter un guard `ApiKeyGuard` (header `x-api-key`) — Intention: protéger l’API ; Livrable: 401 si clé absente/invalide (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/10-code-example-guard-apikey.yaml)
- [x] id25 Ajouter un interceptor qui wrappe la réponse en `{ data }` — Intention: standardiser sans duplication ; Livrable: `WrapResponseInterceptor` appliqué globalement (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/14-code-example-interceptor-transform.yaml)
- [x] id26 Ajouter un interceptor de timing (ms par requête) — Intention: signal perf minimal ; Livrable: `TimingInterceptor` (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/15-code-example-interceptor-timing.yaml)
- [x] id27 Activer Swagger (UI sur `/api`) + déclarer l’API key dans la doc — Intention: documenter/tester l’API ; Livrable: Swagger setup + apiKey header déclaré (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/19-code-example-swagger-bootstrap.yaml)
- [x] id28 TP : guard + interceptor (auth + format) — Intention: ajouter cross-cutting sans toucher au métier ; Livrable: 401 sans clé + réponses `{ data }` (specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/23-exercise-tp-guard-interceptor.yaml)

## 99-conclusion

- [x] id29 Mini-challenge : ajouter un endpoint de A à Z — Intention: être autonome (DTO → validation → service → repo → e2e → Swagger) ; Livrable: 1 endpoint documenté + 1 test e2e OK/KO (specifications/nestjs-backend-3j/99-conclusion/18-exercise.yaml)

## Ajoute en plus

- [x] id30 Ajouter un script `npm run startdb` pour démarrer une instance MariaDB via Docker (Docker Desktop). Ajouter ensuite un script `npm run initdb` pour créer la base de données ainsi que ses tables. Déterminer le schéma (tables et colonnes) en parcourant la formation.
- [x] id31 Ajouter le necessaire dans l'application NestJS pour que la connexion et l'usage de la base de donne MariaDB soit effective. Faire un test E2E d'une insertion en base et son retrieval.

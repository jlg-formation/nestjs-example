# id20 — Écrire un test e2e avec Supertest sur `POST /recharge`

## Role

Tu es un développeur backend senior NestJS/TypeScript orienté qualité. Tu écris des tests e2e lisibles et stables, avec des assertions minimales mais utiles sur le contrat HTTP.

## Objectif

Écrire un **test end-to-end** (e2e) utilisant **Supertest** pour vérifier l’endpoint `POST /recharge`.

Le test doit valider :

- le **status code** (attendu : `201`)
- la présence de `body.data` dans la réponse

Tâche ciblée (TODO): `id20 Écrire un test e2e avec Supertest sur POST /recharge — Livrable: e2e qui assert status + body.data`.

## Format de sortie

- Créer un nouveau fichier de test e2e :
  - `test/recharge.e2e-spec.ts`
- Ne modifier d’autres fichiers que si c’est nécessaire pour que le test soit exécutable et stable.
- Mettre à jour `TODO.md` en cochant **uniquement** `id20` une fois que le test e2e passe.

## Contraintes

- Ne pas implémenter de feature bonus.
  - Un seul test e2e centré sur `POST /recharge` est suffisant.
- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, tests lisibles Arrange/Act/Assert).
- Ne pas inventer d’exigences : se baser sur la tâche `id20` et sur la slide de référence.
- Si un blocage empêche de faire passer le test (DB indisponible, contrat HTTP différent, etc.), **ne pas cocher** `id20` et décrire clairement le blocage.

## Contexte technique

Référence slide: `specifications/nestjs-backend-3j/05-tests/14-code-example-e2e-supertest.yaml`

Extrait (principe) de la slide :

- `request(app.getHttpServer()).post('/recharge').send({...}).expect(201).expect(({ body }) => { expect(body.data).toBeDefined(); ... })`

Éléments utiles dans ce repo :

- Endpoint cible : `src/soldes/recharge.controller.ts`
  - Route : `POST /recharge`
  - Retour : `{ data: ClientDto }`
- DTO d’entrée : `src/soldes/dto/create-recharge.dto.ts` (`clientId`, `amount`)
- DTO de sortie : `src/soldes/dto/client.dto.ts` (au moins `id`, `name`, `balance`)
- Exemple e2e existant (structure Nest + cleanup DB) : `test/soldes-recharge.e2e-spec.ts`
- Lancement des e2e : `npm run test:e2e` (config `test/jest-e2e.json`)

Note importante : dans un test e2e, `createNestApplication()` ne passe pas par `main.ts`. Si le contrat HTTP dépend de configuration globale (validation, filters), il faut la reproduire dans le test pour être fidèle au comportement attendu.

## Étapes (ordre recommandé)

1. Créer `test/recharge.e2e-spec.ts`.
2. Construire l’app avec `Test.createTestingModule({ imports: [AppModule] }).compile()` puis `moduleFixture.createNestApplication()`.
3. Appliquer la configuration globale utilisée par le projet si nécessaire (exemple existant : `ValidationPipe` + `ApiExceptionFilter`).
4. Préparer des données minimales pour que `POST /recharge` réussisse :
   - Créer un client en base avant l’appel (exemple : via `ClientRepository.insert(...)`).
   - Utiliser un `clientId` unique (exemple : `randomUUID()`).
5. Envoyer la requête Supertest :
   - `POST /recharge`
   - body : `{ clientId, amount: 10 }` (adapter la valeur si nécessaire)
6. Assertions minimales (conformes au livrable) :
   - status `201`
   - `body.data` défini
   - (option autorisée car montrée dans la slide) `body.data.balance` strictement supérieur à `0`
7. Nettoyer la base en fin de test (même en cas d’échec) : supprimer les lignes créées (`recharges` / `clients`) afin que le test reste déterministe.
8. Exécuter `npm run test:e2e`.
9. Si tout passe, cocher uniquement `id20` dans `TODO.md`.

## Cas limites (à gérer sans ajouter de nouveaux tests)

- Si l’endpoint `POST /recharge` renvoie un format différent de `{ data: ... }`, vérifier le controller cible et se réaligner sur le contrat attendu par la tâche `id20`.
- Si la DB est requise : documenter le prérequis local (par exemple démarrer MariaDB via `npm run startdb` et initialiser via `npm run initdb`) et garder un cleanup strict dans le test.

## Critères de validation

- Le test e2e est dans `test/recharge.e2e-spec.ts` et utilise `supertest`.
- Le test envoie une requête HTTP sur `app.getHttpServer()`.
- Le test assert :
  - `201`
  - `body.data` est défini
- Le test est stable (données isolées, cleanup effectué).
- `npm run test:e2e` passe.
- `TODO.md` : seule la case `id20` est cochée (uniquement si le test passe).

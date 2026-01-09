# id31 — Connexion MariaDB effective + test E2E (insertion + retrieval)

## Role

Tu es un ingénieur backend senior, expert NestJS (TypeScript), MariaDB/MySQL et tests E2E Jest/Supertest. Tu produis une implémentation sobre, testable et conforme aux conventions du dépôt.

## Objectif

Rendre **effective** la connexion à MariaDB depuis l’application NestJS (pool/connexion injectable), puis le démontrer par un **test E2E** qui effectue :

- une **insertion** en base,
- puis un **retrieval** (relecture) de la donnée,
- avec nettoyage/isolement pour que le test soit déterministe.

## Format de sortie

Livrer une modification du codebase incluant au minimum :

- un câblage NestJS permettant d’injecter un client DB concret derrière le token `DB_CLIENT`,
- la configuration DB via variables d’environnement (via `ConfigModule` déjà en place),
- un (ou plusieurs) test(s) E2E validant insertion + lecture.

À la fin, si et seulement si tout est validé, mettre à jour `TODO.md` en cochant **uniquement** `id31`.

## Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` (rédaction en français académique) et `CODING_RULES.md`.
- Ne pas ajouter de « bonus » : uniquement ce qui est requis pour une connexion DB effective et un test E2E d’insertion + retrieval.
- Aucune information sensible ne doit être hardcodée (credentials DB). La configuration provient de l’environnement.
- Requêtes SQL : toujours **paramétrées** (placeholders), jamais de concaténation.
- Conserver l’architecture Nest : providers injectables, controllers minces.

## Contexte technique

État actuel notable :

- La DB MariaDB est démarrable via Docker : `compose.yaml`.
- La base et les tables existent via : `sql/init.sql` (DB `nestjs_example`, tables `clients`, `recharges`, `reservations`).
- Le token d’injection existe déjà : `src/soldes/client.repository.ts` exporte `DB_CLIENT` et l’interface `DbClient`.
- Le `SoldesModule` fournit aujourd’hui `DB_CLIENT` via un `useValue` qui **rejette** toujours (placeholder) : `src/soldes/soldes.module.ts`.
- Un test E2E existe : `test/app.e2e-spec.ts`.

Point d’attention (traçabilité) : la tâche `id31` dans `TODO.md` ne référence pas de slide YAML. Tu ne dois pas inventer d’exigences issues des slides ; base-toi strictement sur `TODO.md` et sur le schéma SQL existant (`sql/init.sql`).

## Étapes (ordre recommandé)

1. **Choisir et ajouter le driver DB**

- Ajouter une dépendance MySQL/MariaDB standard (ex. `mysql2`) permettant un pool et des requêtes paramétrées.
- Vérifier que le type renvoyé par `query()` est compatible avec l’interface `DbClient` attendue par `ClientRepository`.

2. **Implémenter le provider Nest du client DB**

- Remplacer le placeholder actuel de `DB_CLIENT` par un provider réel (idéalement via `useFactory` + injection de `ConfigService`).
- La configuration minimale attendue (noms proposés, adaptables si le repo impose autre chose) :
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
- Gérer proprement le cycle de vie : fermeture du pool à l’arrêt de l’application (pattern Nest `OnModuleDestroy` ou équivalent).

3. **Vérifier l’usage réel via un test E2E**

- Ajouter un test E2E qui démarre une application Nest via `Test.createTestingModule({ imports: [AppModule] })`.
- Dans le test, prouver l’accès DB en utilisant un composant de l’application (au choix, le plus minimal) :
  - soit `ClientRepository` (préférable car déjà présent et testé en unit),
  - soit le client injecté `DB_CLIENT` directement.
- Le test doit :
  - générer un identifiant unique (ex. `crypto.randomUUID()`),
  - insérer un client dans `clients (id, name)`,
  - relire ce client et vérifier `id` + `name`,
  - nettoyer (DELETE du client inséré), même en cas d’échec (utiliser `try/finally`).

4. **Rendre l’exécution reproductible**

- Le prompt de test doit indiquer explicitement le prérequis local : `npm run startdb` puis `npm run initdb` avant `npm run test:e2e`.
- Si tu ajoutes un fichier d’exemple d’environnement (ex. `.env.example`), il doit rester strictement limité aux variables nécessaires à MariaDB (sans secrets de production).

## Cas limites

- DB non disponible : l’échec doit être explicite (message clair), pas une erreur cryptique.
- Nettoyage : le test ne doit pas laisser de données résiduelles dans `clients`.
- Compatibilité types : éviter `any` si possible ; sinon limiter et typer la frontière `mysql2` → `DbClient`.

## Critères de validation

Checklist de succès :

- [ ] Le provider `DB_CLIENT` n’est plus un placeholder et exécute réellement des requêtes sur MariaDB.
- [ ] Les credentials/host/port/db sont configurables via variables d’environnement (via `ConfigService`).
- [ ] Un test E2E prouve insertion + retrieval et passe après `npm run startdb` + `npm run initdb`.
- [ ] Le test E2E est déterministe (id unique + nettoyage garanti).
- [ ] `npm run lint` et `npm run test:e2e` passent (ou bien tout échec est expliqué et bloque la coche de la tâche).
- [ ] `TODO.md` : cocher `[x]` uniquement `id31` **uniquement si** tous les critères ci-dessus sont validés.

## Tests

Exécuter a minima :

- `npm run test:e2e`
- (recommandé) `npm run test` et `npm run lint`

Si un blocage empêche la réussite (ex. DB non démarrable, ports indisponibles), ne pas cocher `id31` et décrire précisément le blocage (commande exécutée, message d’erreur, hypothèse).

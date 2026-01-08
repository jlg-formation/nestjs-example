# id30 — Scripts `startdb` / `initdb` MariaDB (Docker Desktop)

## Role

Vous êtes un ingénieur backend senior spécialisé en **NestJS (TypeScript)**, avec une forte expérience en **outillage local de développement** (Docker Desktop, scripts Node/TS, ergonomie npm).

## Objectif

Implémenter la tâche **id30** du fichier `TODO.md` :

- Ajouter un script `npm run startdb` qui démarre une instance **MariaDB** via **Docker Desktop**.
- Ajouter un script `npm run initdb` qui crée la **base de données** et ses **tables**.
- Déterminer et implémenter le **schéma (tables/colonnes)** en s’appuyant sur le contenu de la formation (slides YAML), sans inventer de fonctionnalités.

> Remarque importante : l’entrée `id30` dans `TODO.md` ne référence pas de slide YAML (contrairement aux autres tâches). Vous devez donc **vous baser explicitement** sur les slides SQL/CRUD existants ci-dessous et, en cas de doute sur le schéma exact attendu, **documenter l’hypothèse** et demander validation (ne pas cocher la tâche tant que l’ambiguïté n’est pas levée).

## Format de sortie

Modifications attendues (au minimum) :

- `package.json` : ajout des scripts `startdb` et `initdb`.
- Un mécanisme de démarrage DB via Docker, au choix (privilégier le plus simple et reproductible) :
  - Option A (recommandée) : un fichier `compose.yaml` / `docker-compose.yml` + `npm run startdb` qui exécute `docker compose up -d`.
  - Option B : un script qui exécute `docker run ...`.
- Un ou plusieurs fichiers SQL d’initialisation (ex: `sql/init.sql`), créant la base et les tables.
- Un script d’initialisation `initdb` qui applique le SQL au conteneur (ex: via `docker exec ... mariadb ... < sql/init.sql`), compatible Windows.

Livrable final : une DB MariaDB démarrable et initialisable localement via **deux commandes npm**.

## Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, cohérence, pas d’abstraction inutile, scripts lisibles).
- Ne pas ajouter de fonctionnalités “bonus” (pas de Swagger, pas de nouvelles routes, pas de couche DB applicative supplémentaire) : uniquement l’outillage `startdb/initdb` + schéma.
- Ne pas traiter le chapitre `01-typescript-mini-express` (hors périmètre du repo).
- Être pragmatique sur Windows : éviter les scripts shell non portables. Préférer :
  - soit `docker compose ...` directement dans `package.json`,
  - soit des scripts TypeScript exécutés par `ts-node` (le repo l’utilise déjà via `scripts/kill-port.ts`).
- Ne pas exposer de secrets réels : si vous mettez des identifiants, ils doivent être **uniquement de dev local** et clairement identifiables comme tels.
- À la fin, si et seulement si tout est validé, mettre à jour `TODO.md` en cochant `[x]` **uniquement** `id30`. Si blocage/ambiguïté/tests KO : **interdiction de cocher** et vous devez décrire le blocage.

## Contexte technique

État actuel pertinent :

- Scripts npm existants : voir `package.json` (il n’y a pas encore `startdb`/`initdb`).
- Le repo contient déjà un dossier `scripts/` avec un script TypeScript (`scripts/kill-port.ts`) et `ts-node` en devDependency.
- Slides de formation utiles pour déduire le schéma minimal (sources d’exigences) :
  - `specifications/nestjs-backend-3j/04-crud-architecture/10-diagram-schema-minimal.yaml` : tables attendues `clients`, `recharges`, `reservations` (+ rôle des colonnes).
  - `specifications/nestjs-backend-3j/04-crud-architecture/11-code-example-sql-insert-recharge.yaml` : insertion `recharges (client_id, amount)` et update `clients.balance`.
  - `specifications/nestjs-backend-3j/04-crud-architecture/12-code-example-sql-insert-reservation.yaml` : insertion `reservations (client_id, reference, amount)` et update conditionnel.
  - `specifications/nestjs-backend-3j/05-tests/19-code-example-transaction-rollback.yaml` : exemple `clients (id, name, balance)`.

Indications minimales sur le schéma (à confirmer/compléter à partir des slides) :

- `clients` : `id`, `name`, `balance`.
- `recharges` : `client_id` (FK vers `clients.id`), `amount` (+ éventuellement `created_at` mentionné dans le diagramme).
- `reservations` : `client_id` (FK), `reference`, `amount`.

## Étapes (ordre recommandé)

1. Définir la stratégie Docker (compose vs `docker run`) et l’emplacement des fichiers SQL.
2. Définir le schéma SQL minimal **strictement** compatible avec les colonnes réellement utilisées dans les exemples de requêtes des slides.
3. Implémenter `npm run startdb`.
4. Implémenter `npm run initdb` pour :
   - créer la base (si nécessaire),
   - créer les tables,
   - poser les clés étrangères,
   - (optionnel uniquement si explicitement justifié par les slides) créer les index/colonnes temporelles.
5. Vérifier le fonctionnement bout-en-bout :
   - `npm run startdb`
   - `npm run initdb`
   - connexion MariaDB et vérification que les tables existent.
6. Mettre à jour `TODO.md` : cocher uniquement `id30` si tout est OK.

## Cas limites à gérer

- Si le conteneur existe déjà : `startdb` doit soit réutiliser le conteneur, soit afficher une erreur claire avec marche à suivre.
- Si `initdb` est relancé : définir un comportement clair (ex: tables déjà présentes). Éviter de “casser” l’environnement sans prévenir.
- Si Docker Desktop n’est pas démarré : erreur explicite.

## Critères de validation

Checklist de succès (à cocher implicitement via vos vérifications) :

- `npm run startdb` démarre MariaDB via Docker (conteneur visible via `docker ps`).
- `npm run initdb` crée la base + les tables `clients`, `recharges`, `reservations` avec les colonnes nécessaires aux requêtes des slides.
- Les clés étrangères (`recharges.client_id → clients.id`, et idem pour `reservations`) sont présentes.
- Aucune dépendance “surprise” non justifiée n’est ajoutée (priorité à `docker compose` / scripts TS existants).
- `TODO.md` est mis à jour en cochant `[x] id30` uniquement si tout est validé ; sinon, un blocage est décrit.

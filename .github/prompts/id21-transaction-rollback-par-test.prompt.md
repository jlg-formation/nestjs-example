# Role

Tu es un expert NestJS / TypeScript, avec une forte pratique des tests e2e (Jest + Supertest) et de MySQL/MariaDB (mysql2). Tu sais rendre les tests déterministes et isolés sans ralentir inutilement la suite.

# Objectif

Mettre en place une stratégie "1 test = 1 transaction = rollback" pour les tests e2e afin que la base MariaDB soit propre après chaque test, sans devoir supprimer manuellement des lignes avec des `DELETE`.

Le livrable attendu correspond à la slide : hooks `beforeEach` / `afterEach` qui démarrent une transaction puis font un rollback.

# Format de sortie

- Mettre à jour les tests e2e existants pour utiliser une transaction par test et supprimer les nettoyages manuels quand ils deviennent inutiles.
- Ajouter, si nécessaire, un petit utilitaire de test (dans `test/`) pour fournir un `DbClient` utilisable dans une transaction et injecté via le token `DB_CLIENT`.
- Mettre à jour `TODO.md` en cochant `[x]` uniquement `id21` si (et seulement si) tous les critères de validation sont satisfaits.

# Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, tests lisibles, controllers minces, pas de magie inutile).
- Ne pas ajouter de feature "bonus" : rester strictement sur la stratégie transaction + rollback par test.
- Les tests doivent rester déterministes et ne pas dépendre de l’ordre d’exécution.
- Toujours libérer les ressources (connexion DB / app Nest) même en cas d’échec d’un test.
- Si tu es bloqué (ex: impossibilité technique liée aux transactions), ne coche pas `id21` et documente clairement le blocage.

# Contexte technique

## Tâche sélectionnée

- `id21 Mettre en place une stratégie “transaction + rollback par test”` (specifications/nestjs-backend-3j/05-tests/19-code-example-transaction-rollback.yaml)

## Exigences tirées de la slide YAML

- Idée : chaque test démarre dans une transaction.
- Nettoyage : rollback après chaque test.
- Attention : en e2e, plusieurs connexions (pool) peuvent compliquer.

## Codebase (points d’appui)

- Token d’injection DB : `DB_CLIENT` dans `src/soldes/client.repository.ts`.
- Client DB actuel : `MysqlDbClient` dans `src/db/mysql-db-client.ts` (pool mysql2).
- Le `DbClient` expose `query()` + `createTransaction()`.
- Plusieurs repositories ouvrent leurs propres transactions via `createTransaction()` (ex: `src/soldes/recharge.repository.ts`).
- Tests e2e actuels (nettoyage manuel via `DELETE`) :
  - `test/mariadb.e2e-spec.ts`
  - `test/recharge.e2e-spec.ts`
  - `test/soldes-recharge.e2e-spec.ts`

## Problème à résoudre (important)

Si tu ouvres une transaction dans le test mais que l’application continue d’utiliser le pool (autre connexion), le rollback ne nettoiera pas les écritures faites par les endpoints.
Conclusion : pour que "rollback par test" fonctionne en e2e, l’application testée doit exécuter ses requêtes SQL via la même connexion/transaction que le test.

# Étapes (ordre recommandé)

1. Concevoir un `DbClient` dédié aux tests e2e qui :
   - utilise une seule connexion MariaDB par test (pas le pool multi-connexions),
   - démarre une transaction en `beforeEach`,
   - exécute toutes les requêtes (celles de l’app incluse) sur cette connexion,
   - effectue un rollback en `afterEach` puis libère la connexion.

2. Gérer le cas des transactions internes (repositories) :
   - Les repositories appellent `createTransaction()` puis `begin/commit/rollback`.
   - Pour rester compatible sans modifier le code applicatif, le `DbClient` de test doit permettre ces appels sans faire un `COMMIT` définitif sur la transaction de test.
   - Stratégie minimale recommandée : implémenter `createTransaction()` en s’appuyant sur des `SAVEPOINT` (pseudo-transactions imbriquées) sur la même connexion.
     - `begin()` -> `SAVEPOINT sp_<n>`
     - `commit()` -> `RELEASE SAVEPOINT sp_<n>` (ou no-op si nécessaire)
     - `rollback()` -> `ROLLBACK TO SAVEPOINT sp_<n>`
     - `release()` -> no-op (la connexion est relâchée par le hook `afterEach` du test)

3. Mettre en place l’injection du `DbClient` de test :
   - Dans chaque suite e2e, lors du `Test.createTestingModule({ imports: [AppModule] })`, override le provider `DB_CLIENT` pour utiliser le client de test.
   - Si plusieurs fichiers e2e partagent le même setup, factoriser le bootstrap dans un helper sous `test/` (ex: `test/utils/create-e2e-app.ts`).

4. Mettre à jour les tests e2e existants :
   - Remplacer les `try/finally` + `DELETE` par un ensemencement dans `beforeEach` et laisser `afterEach` rollback.
   - Conserver les assertions existantes.
   - Pour les tests qui n’écrivent rien en DB (ex: test 400), ils doivent quand même être compatibles avec la stratégie (hooks ok, rollback ok).

5. Vérifier que la DB est bien propre après un test :
   - Ajouter au moins une vérification simple (dans un test existant) que l’écriture ne persiste pas au test suivant, ou vérifier via une requête DB dans un second test.
   - Ne pas surcharger la suite : rester minimal.

# Cas limites / points d’attention

- Toujours exécuter `rollback` + libération de connexion en `afterEach`, même si le test échoue.
- Éviter les connexions multiples : ne pas utiliser `MysqlDbClient` pool tel quel pour ces suites si cela casse l’isolation.
- Si tu utilises des `SAVEPOINT`, garantir des noms uniques (compteur simple par test).
- Vérifier que `test:e2e` tourne en séquentiel ou que chaque fichier de test ne partage pas la même connexion globale (une connexion par test est le plus sûr).

# Critères de validation

- Les tests e2e s’exécutent via `npm run test:e2e` et passent.
- Les suites e2e n’ont plus besoin de `DELETE FROM ...` pour nettoyer les données créées par les tests couverts par la stratégie.
- La stratégie correspond à l’intention de la slide : transaction au démarrage du test + rollback après le test.
- Aucune modification du chapitre `01-typescript-mini-express`.
- `TODO.md` : cocher `[x]` uniquement `id21` si tout est OK. Sinon, laisser non coché et expliquer le blocage.

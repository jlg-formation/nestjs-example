# Role

Tu es un développeur backend senior spécialisé en NestJS (TypeScript) et en accès base de données MariaDB/MySQL avec `mysql2/promise`. Tu écris un code simple, lisible, testable, et tu respectes strictement les conventions du repository.

# Objectif

Implémenter `RechargeRepository` pour encapsuler **tout** le SQL de la recharge dans **une transaction courte** :

- `INSERT` dans `recharges`
- `UPDATE` du solde dans `clients`
- `SELECT` du client mis à jour
- `begin` / `commit` / `rollback`

Le repository doit exposer une méthode unique de type `applyRecharge(clientId, amount)` qui retourne un `ClientDto` (client existant) ou `null` (client absent / non mis à jour).

# Format de sortie

Modifier uniquement le code applicatif (pas de génération de slides) pour livrer la fonctionnalité :

- `src/soldes/recharge.repository.ts` : implémentation transactionnelle (méthode `applyRecharge`)
- `src/soldes/recharge.service.ts` : utiliser `applyRecharge` (et supprimer la logique SQL éclatée)
- `src/soldes/client.repository.ts` et/ou `src/db/mysql-db-client.ts` : ajouter le support transactionnel requis par le repository
- Mettre à jour `TODO.md` en cochant **uniquement** `id16` une fois terminé

# Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, controllers minces, SQL paramétré).
- SQL **obligatoirement** paramétré (placeholders `?`), jamais de concaténation.
- La transaction doit être **sûre en concurrence** : ne pas stocker une connexion transactionnelle dans un singleton partagé entre requêtes.
- En cas d’erreur dans la transaction : `rollback` puis relancer l’erreur.
- Si la tâche n’est pas complètement terminée (exigence manquante, tests KO, blocage), **interdiction** de cocher `id16` dans `TODO.md` ; décrire le blocage.
- Pas de “bonus features” : uniquement ce qui est nécessaire pour `id16`.

# Contexte technique

Sources fonctionnelles :

- Tâche `id16` dans `TODO.md`.
- Slide YAML : `specifications/nestjs-backend-3j/04-crud-architecture/20-code-example-repository-recharge.yaml`.

État actuel du code :

- `RechargeRepository` existe déjà mais découpe l’opération en plusieurs méthodes sans transaction.
- `RechargeService.recharge()` appelle plusieurs méthodes (`insertRecharge`, `incrementBalance`, puis re-lit via `ClientRepository`).
- `DbClient` (token `DB_CLIENT`) ne propose que `query()` ; aucune API transactionnelle n’existe pour l’instant.
- La DB est MariaDB/MySQL via `mysql2/promise` et un pool dans `MysqlDbClient`.

Référence de comportement attendu (slide) :

- `applyRecharge(clientId, amount): Promise<ClientDto | null>`
- transaction : `begin()` → try → `commit()` → return ; catch → `rollback()` → throw
- si l’`UPDATE clients ...` n’affecte pas exactement 1 ligne : retourner `null` (et ne pas valider de résultat incohérent)

# Critères de validation

Checklist de réussite :

- `RechargeRepository.applyRecharge()` encapsule `INSERT recharges` + `UPDATE clients` + `SELECT client` dans une transaction.
- Les requêtes utilisent des paramètres (`?`).
- La transaction fait bien `commit` en succès et `rollback` en cas d’exception.
- Le service utilise `applyRecharge()` et traduit le `null` en `NotFoundException` (ou comportement équivalent déjà établi par `id15`).
- `npm run lint` passe.
- `npm test` et `npm run test:e2e` passent (au minimum, ne pas casser les tests existants).
- `TODO.md` : seule la case `id16` est cochée (si tout est OK).

# Étapes (ordre recommandé)

1. Lire la slide YAML référencée et comparer avec l’existant (`RechargeRepository` et `RechargeService`).
2. Définir une API transactionnelle utilisable par le repository sans état global partagé.
   - Option recommandée : enrichir `DbClient` avec une primitive transactionnelle sûre (par exemple obtenir une connexion dédiée par transaction), tout en permettant au repository d’appeler `begin/commit/rollback` conformément à la slide.
3. Implémenter `applyRecharge(clientId, amount)` dans `RechargeRepository` :
   - `begin()`
   - `INSERT INTO recharges (client_id, amount) VALUES (?, ?)`
   - `UPDATE clients SET balance = balance + ? WHERE id = ?`
   - vérifier `affectedRows === 1`, sinon retourner `null`
   - `SELECT id, name, balance FROM clients WHERE id = ?`
   - `commit()`
   - retourner le premier row mappé en `ClientDto` ou `null`
   - `catch` : `rollback()` puis `throw`
4. Adapter `RechargeService.recharge()` pour appeler uniquement `applyRecharge()`.
   - Si `applyRecharge()` retourne `null` : lever `NotFoundException('Client not found')` (ou message déjà utilisé).
5. Exécuter lint + tests.
6. Cocher `id16` dans `TODO.md` uniquement si tout est validé.

# Cas limites

- `clientId` inexistant : l’opération doit échouer proprement (retour `null` côté repo, exception 404 côté service).
- Erreur SQL (FK, connexion, etc.) : `rollback` puis propagation de l’erreur.
- Transaction : s’assurer qu’aucune écriture partielle ne reste si un des appels SQL échoue.

# Tests

- Ne pas créer de nouvelle stratégie de test.
- Vérifier que les tests existants continuent de passer :
  - `npm test`
  - `npm run test:e2e`
- En particulier, le e2e `POST /soldes/recharge` doit continuer à insérer une recharge et à rester stable.

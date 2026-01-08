---
mode: agent
---

# id11 — Repository SQL brut (SELECT + INSERT paramétrés)

## Role

Vous êtes un ingénieur backend senior, expert NestJS (TypeScript) et architecture Controller → Service → Repository. Vous êtes attentif à la lisibilité, au typage minimal utile et à la sécurité (requêtes SQL paramétrées).

## Objectif

Implémenter un **repository SQL brut injectable** qui encapsule des requêtes **SELECT** et **INSERT** en SQL **paramétré** (placeholders `?`).

Le livrable attendu pour cette tâche est un repository de type `ClientRepository` (ou équivalent) exposant au minimum :

- `findById(...)` → retourne un enregistrement typé ou `null`
- `insert(...)` → insère un enregistrement via SQL paramétré

Source (slide) : `specifications/nestjs-backend-3j/03-validation-sql-services/18-code-example-sql-repository.yaml`.

## Format de sortie

Produire uniquement ce qui est nécessaire pour la tâche `id11` :

- Un fichier TypeScript de repository (exemples de localisation acceptables selon l’organisation existante) :
  - `src/soldes/client.repository.ts` (simple et cohérent avec l’état actuel), **ou**
  - `src/soldes/repositories/client.repository.ts` (si vous introduisez un sous-dossier).
- Les ajustements minimaux pour que Nest puisse **instancier** le repository (providers) sans casser le démarrage.

Ne pas créer d’autres modules “bonus” ni de refonte d’architecture.

## Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md` (simplicité, controllers minces, typage raisonnable, SQL paramétré).
- Ne pas implémenter de features supplémentaires (pas d’endpoints nouveaux, pas de swagger, pas de transactions ici).
- Le SQL doit utiliser des placeholders `?` avec tableau de paramètres.
- Ne pas construire de SQL via concaténation de strings.
- Le repository doit être `@Injectable()`.
- Garder le retour **typé** (au minimum un type `ClientRow`), et éviter `any` si possible.
- Tant que l’infrastructure DB n’est pas présente dans le codebase, choisir l’option **la plus minimale** permettant de satisfaire l’injection Nest (voir « Contexte technique »).

## Contexte technique

État actuel (à date) :

- Module feature : `src/soldes/soldes.module.ts`.
- Service : `src/soldes/soldes.service.ts` (pas encore de DB, pas de SQL dans le code).
- Le projet n’a pas de dépendance SQL déclarée dans `package.json` (pas de `mysql2` actuellement).

Référence slide (extrait conceptuel) :

- Repository injectable.
- Dépendance `db` injectée exposant `query(...)`.
- `findById` exécute un `SELECT ... WHERE id = ?` et retourne `first ?? null`.
- `insert` exécute un `INSERT ... VALUES (?, ?)`.

### Point d’attention : injection de `db`

La slide montre `constructor(private readonly db: { query: Function }) {}`.
Dans NestJS réel, injecter un objet “nu” sans token explicite peut échouer à l’exécution.

Vous devez donc choisir une stratégie **minimale** et compatible avec l’état actuel du repo :

- Option A (recommandée, minimale et explicite) :
  - Définir un token d’injection (ex: `DB_CLIENT`) et injecter via `@Inject(DB_CLIENT)`.
  - Fournir ce token dans le module (ex: `SoldesModule`) avec un `useValue` ou `useFactory` exposant `query`.
  - Si aucune DB n’est configurée, `query` peut temporairement lever une erreur claire (ou retourner une valeur neutre), à condition de **ne pas casser** les routes existantes qui n’utilisent pas encore le repository.
- Option B : si vous introduisez déjà un vrai client SQL (uniquement si c’est déjà attendu/présent dans le projet au moment de l’implémentation) :
  - Injecter un pool/driver (ex: `mysql2/promise`) derrière le même contrat `query(sql, params)`.

Dans tous les cas : rester strictement dans le périmètre `id11`.

## Étapes (recommandées)

1. Créer un type minimal pour les lignes (ex: `type ClientRow = { id: string; name: string }`).
2. Créer la classe `ClientRepository` décorée avec `@Injectable()`.
3. Définir l’interface minimale du client DB attendu : `query(sql: string, params: unknown[]): Promise<[unknown]>` (ou proche), en évitant `Function` si possible.
4. Implémenter :
   - `findById(id: string): Promise<ClientRow | null>` avec :
     - `SELECT id, name FROM clients WHERE id = ?`
     - extraction du premier élément et retour `null` si absent.
   - `insert(client: ClientRow): Promise<void>` avec :
     - `INSERT INTO clients (id, name) VALUES (?, ?)`
5. Rendre l’injection Nest viable :
   - ajouter le repository (et, si nécessaire, le provider du token DB) dans `providers` du module concerné.
6. Vérifier que `npm run lint` et `npm test` ne régressent pas.

## Cas limites

- `findById` :
  - si 0 ligne → retourner `null` (pas d’exception ici).
  - ne pas retourner `undefined`.
- `insert` :
  - pas de concat SQL.
  - accepter que les erreurs SQL soient gérées plus tard (ne pas ajouter de filter ici : c’est la tâche `id12`).

## Tests

Ne pas ajouter de tests “bonus” si la base de tests n’est pas prête, mais :

- Si vous pouvez ajouter un test unitaire simple sans dépendre d’une DB, vous pouvez mocker l’objet `db` (token/provider) et vérifier :
  - que `query` est appelée avec le bon SQL et le bon tableau de paramètres,
  - que `findById` renvoie `null` si `rows` est vide.

## Critères de validation

- Le repository est présent, `@Injectable()`, et encapsule bien le SQL.
- Les requêtes utilisent **exclusivement** des placeholders `?` + paramètres.
- `findById` retourne `ClientRow | null`.
- `insert` exécute un `INSERT` paramétré.
- L’application démarre toujours (pas d’erreur d’injection au runtime lors du bootstrap).
- Qualité : code lisible, typage minimal utile, conforme à `CODING_RULES.md`.

## Mise à jour de TODO.md (obligatoire)

Une fois la tâche **terminée** et validée (lint/tests OK quand applicable) :

- Cocher **uniquement** la case `[x]` de `id11` dans `TODO.md`.

Si vous êtes bloqué (ex: absence de client DB et impossibilité de fournir un provider minimal sans casser le démarrage) :

- **Ne cochez pas** la tâche.
- Décrivez précisément le blocage et l’hypothèse manquante.

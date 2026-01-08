# id08 — Charger `.env` avec `ConfigModule` et injecter `ConfigService`

## Role

Tu es un développeur backend senior expert NestJS + TypeScript, rigoureux sur l’architecture (modules/controllers/services) et sur la configuration applicative. Tu appliques les conventions du repo (voir `AGENTS.md` et `CODING_RULES.md`) et tu implémentes uniquement ce qui est demandé.

## Objectif

Mettre en place la configuration applicative via `@nestjs/config` pour :

- Charger les variables d’environnement (notamment via `.env` en dev) avec `ConfigModule.forRoot()`.
- Rendre la configuration disponible globalement avec `isGlobal: true`.
- Injecter `ConfigService` dans un service existant (ou un service minimal si nécessaire) et lire une variable `DB_HOST` avec une valeur par défaut `localhost`.

## Format de sortie

Changements attendus dans le code existant (sans ajouter de “bonus features”) :

- Mise à jour de `src/app.module.ts` pour importer `ConfigModule.forRoot({ isGlobal: true })`.
- Un exemple concret d’injection de `ConfigService` dans un service (`@Injectable`) du projet (idéalement dans un service déjà présent), avec une méthode lisant :
  - `config.get<string>('DB_HOST', 'localhost')`
- Si le repo utilise/attend un fichier `.env` en local, l’ajouter uniquement si nécessaire au fonctionnement démonstratif (sinon, laisser la lecture se faire via l’environnement et documenter brièvement comment tester).

## Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Rester strictement dans le périmètre de la tâche `id08` : configuration via `ConfigModule` + injection/lecture via `ConfigService`.
- Respecter l’architecture Nest : pas de logique métier dans un module ; injection via constructeur.
- Ne pas introduire de configuration “maison” (pas de wrapper inutile, pas de singleton custom).
- Éviter `any` et typer l’accès config (ex: `get<string>(...)`).
- Ne pas reformatter des fichiers entiers si la modif est locale.

## Contexte technique

Source (slide YAML) : `specifications/nestjs-backend-3j/03-validation-sql-services/06-code-example-configservice.yaml`

Exemple attendu par la slide :

- `ConfigModule.forRoot({ isGlobal: true })` dans `AppModule`.
- Un service injectable qui fait :
  - `return this.config.get<string>('DB_HOST', 'localhost');`
- Comportement attendu : si `DB_HOST` est absent, la valeur retournée est `'localhost'`.

Fichiers probables à modifier dans ce repo :

- `src/app.module.ts`
- Un service existant dans `src/soldes/` (ou un service minimal dédié si aucun endroit cohérent n’existe)

## Étapes (recommandées)

1. Vérifier que `@nestjs/config` est présent dans `package.json` ; sinon l’ajouter (dépendance) selon les pratiques du repo.
2. Mettre à jour `src/app.module.ts` : ajouter `ConfigModule` dans `imports` avec `forRoot({ isGlobal: true })`.
3. Choisir un service existant où la démonstration est la plus simple (ex: `SoldesService`) :
   - Injecter `ConfigService` via le constructeur.
   - Ajouter une méthode dédiée (ex: `getDbHost()`), ou le minimum permettant de prouver l’injection.
4. S’assurer que la valeur par défaut fonctionne quand `DB_HOST` n’est pas défini.
5. (Option minimale) Ajouter un test unitaire simple si le repo a déjà des tests unitaires pour ce service, pour valider la valeur par défaut. Sinon, fournir une commande de vérification manuelle (voir ci-dessous) sans créer une nouvelle infra.

## Critères de validation

Checklist de succès :

- [ ] L’application démarre sans erreur après ajout de `ConfigModule`.
- [ ] `ConfigModule.forRoot({ isGlobal: true })` est présent dans `src/app.module.ts`.
- [ ] Un service `@Injectable()` du projet injecte `ConfigService` via le constructeur.
- [ ] Le code lit `DB_HOST` via `config.get<string>('DB_HOST', 'localhost')`.
- [ ] Quand `DB_HOST` est absent, la valeur retournée est `'localhost'` (comportement observable via test ou vérification manuelle).

## Exemples de vérification manuelle (si aucun test n’est ajouté)

- Sans variable : démarrer l’app et appeler/observer le chemin de code qui retourne `DB_HOST` (attendu: `localhost`).
- Avec variable : définir `DB_HOST=example` dans l’environnement (ou `.env` si déjà utilisé dans le repo) et vérifier que la valeur lue change.

## Cas limites

- `DB_HOST` défini mais vide : décider explicitement si tu acceptes la chaîne vide telle quelle (comportement standard de `ConfigService`) ou si tu normalises (si tu normalises, le justifier et rester minimal).
- Ne pas rendre la config obligatoire à ce stade : garder un default raisonnable en dev comme dans la slide.

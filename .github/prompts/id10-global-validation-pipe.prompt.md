# id10 — Global ValidationPipe (whitelist/forbid/transform)

## Role

Tu es un·e développeur·se senior NestJS/TypeScript. Tu appliques les conventions du repo (voir `AGENTS.md` et `CODING_RULES.md`) et tu livres un changement minimal, propre, vérifié par tests/essais.

## Objectif

Activer un `ValidationPipe` **global** dans l’application NestJS, afin que toute l’API soit strictement validée par défaut.

Configuration attendue (conformément à la slide) :

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Résultat attendu : un body contenant un champ inconnu doit provoquer une réponse **400**.

## Format de sortie

- Modifier uniquement le bootstrap pour activer le pipe global :
  - `src/main.ts`
- (Optionnel seulement si nécessaire pour compiler/linter) ajustements minimes d’imports.
- Une fois validé : cocher **uniquement** la tâche `id10` dans `TODO.md`.

## Contraintes

- Ne pas ajouter de nouvelles features/endpoints.
- Rester strictement dans le périmètre de la tâche `id10`.
- Conserver le style et les conventions du repo (KISS, "thin controller", pas de refactor non lié).
- Ne pas casser le comportement existant de démarrage (notamment le port `process.env.PORT ?? 3000` déjà en place).
- Ne cocher `[x]` dans `TODO.md` **que si** : build/lint/tests (quand applicable) et vérification fonctionnelle OK.
- Si un blocage survient (package manquant, test cassé, etc.), **ne pas cocher** `id10` et décrire clairement le blocage.

## Contexte technique

- Tâche : `id10 Activer ValidationPipe global (whitelist/forbid/transform)` dans `TODO.md`.
- Slide source : `specifications/nestjs-backend-3j/03-validation-sql-services/11-code-example-main-validationpipe.yaml`.
- Fichier bootstrap actuel : `src/main.ts`.
- Un DTO validé existe déjà (pré-requis logique de cette étape) : `src/soldes/dto/create-recharge.dto.ts`.

## Étapes (recommandées)

1. Ouvrir `src/main.ts`.
2. Ajouter l’import de `ValidationPipe` depuis `@nestjs/common`.
3. Après la création de l’app (`NestFactory.create(AppModule)`), ajouter :
   - `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`
4. Garder l’écoute du port existante (`await app.listen(process.env.PORT ?? 3000);`) et le pattern existant (`void bootstrap();`) si présent.

## Exemples de vérification (manuel)

But : prouver le **400 sur champ inattendu**.

- Exemple payload valide (sur l’endpoint existant de recharge si présent) :

  ```json
  {
    "clientId": "abc",
    "amount": 10
  }
  ```

- Exemple payload invalide (champ inattendu `unexpected`) :
  ```json
  {
    "clientId": "abc",
    "amount": 10,
    "unexpected": true
  }
  ```

Attendu : HTTP 400 (car `forbidNonWhitelisted: true`).

Notes :

- `whitelist: true` supprime les champs inattendus ; combiné à `forbidNonWhitelisted`, cela provoque une erreur 400 au lieu d’ignorer silencieusement.
- `transform: true` transforme le payload en instance de DTO (et peut aider à typer les entrées selon la configuration Nest).

## Tests

- Lancer au minimum :
  - `npm test`
  - `npm run test:e2e` (si configuré / pertinent)
- Si des tests existants échouent pour une raison non liée au pipe global, ne pas les « réparer » hors-scope : documenter le problème et s’arrêter.

## Critères de validation

- [ ] `src/main.ts` configure un `ValidationPipe` global avec `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- [ ] L’app démarre toujours normalement (y compris via `PORT` env si utilisé).
- [ ] Un body avec un champ inconnu provoque une réponse HTTP **400**.
- [ ] Les checks qualité passent (au minimum `npm test`, et `npm run test:e2e` si applicable).
- [ ] `TODO.md` : seule la case `id10` est cochée, et uniquement si tout est OK.

# id03 — Controller minimal: @Controller + @Get + @Post

## Role

Tu es un développeur senior **NestJS / TypeScript**, orienté code simple et pédagogique. Tu appliques strictement les conventions du repo (voir `CODING_RULES.md`).

## Objectif

Implémenter un controller NestJS minimaliste pour comprendre le routing :

- `GET /soldes/ping` retourne un JSON `{ ok: true }`
- `POST /soldes/recharge` lit le body et retourne un JSON `{ ok: true, amount: <amount> }`

Aucune logique métier, aucune validation avancée : c’est volontairement minimal (la validation viendra plus tard).

## Format de sortie

Modifications attendues dans le codebase :

- `src/soldes/soldes.controller.ts` : ajouter les routes `ping` et `recharge` avec les décorateurs Nest

Optionnel (uniquement si pertinent et minimal) :

- `src/soldes/soldes.controller.spec.ts` : ajouter 1–2 tests unitaires très simples pour vérifier les méthodes `ping()` et `recharge()`

## Contraintes

- Respecter la slide source : `specifications/nestjs-backend-3j/02-demarrage-nestjs/09-code-example-controller-get-post.yaml`
- Ne pas introduire de service / DI / DB : la transition vers le service est la tâche suivante (id04)
- Ne pas ajouter de DTO `class-validator`, ni `ValidationPipe` (introduits plus tard)
- Conserver le style TypeScript/Nest du repo (imports depuis `@nestjs/common`, quotes cohérentes)
- Ne pas ajouter de features “bonus” (pas de nouveaux endpoints, pas de format de réponse différent)

## Contexte technique

État actuel (déjà présent dans le repo) :

- `src/soldes/soldes.controller.ts` contient `@Controller('soldes')` mais aucune route
- `src/soldes/soldes.module.ts` déclare déjà `SoldesController`
- `src/app.module.ts` importe déjà `SoldesModule` (donc les routes seront exposées automatiquement)

Extrait attendu d’après la slide (à adapter au style du repo) :

- Importer `Body`, `Controller`, `Get`, `Post` depuis `@nestjs/common`
- Déclarer :
  - `@Get('ping') ping() { return { ok: true } }`
  - `@Post('recharge') recharge(@Body() body: { amount: number }) { return { ok: true, amount: body.amount } }`

Note slide : “validation plus tard” → on se contente de typer `body` en `{ amount: number }`.

## Étapes (recommandées)

1. Mettre à jour `src/soldes/soldes.controller.ts` :
   - compléter l’import `@nestjs/common`
   - ajouter `ping()` et `recharge()` avec les bons décorateurs et chemins
2. Vérifier que l’app démarre et que les routes répondent
3. (Optionnel) Étendre le test unitaire controller pour valider les retours des méthodes

## Exemples

- Requête : `GET /soldes/ping`
  - Réponse attendue : `200` avec body `{ "ok": true }`

- Requête : `POST /soldes/recharge` avec body JSON `{ "amount": 100 }`
  - Réponse attendue : `201` (comportement Nest par défaut pour POST) avec body `{ "ok": true, "amount": 100 }`

## Tests / vérifications

Checklist de validation :

- [ ] `GET /soldes/ping` renvoie `{ ok: true }`
- [ ] `POST /soldes/recharge` lit `amount` depuis le body et renvoie `{ ok: true, amount }`
- [ ] Aucune dépendance au service `SoldesService` (le controller reste minimal)
- [ ] `npm run lint` ne remonte pas d’erreurs liées au controller
- [ ] (Si tests modifiés) `npm test` passe au moins pour les specs du controller

## Critères de validation

- Les deux endpoints existent exactement aux chemins :
  - `/soldes/ping` (GET)
  - `/soldes/recharge` (POST)
- Les réponses JSON correspondent exactement à la slide
- Aucun ajout de validation / DTO / couche métier à ce stade

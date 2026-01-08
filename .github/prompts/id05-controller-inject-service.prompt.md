# id05 — Injecter un service dans un controller

## Role

Tu es un développeur backend senior NestJS/TypeScript. Tu connais l’injection de dépendances Nest (constructor injection), l’organisation module/controller/service, et tu écris un code simple et idiomatique.

## Objectif

Implémenter une route HTTP qui illustre l’injection de dépendances :

- Exposer `GET /clients/:id/soldes`
- Déléguer la logique de calcul du solde au service existant `SoldesService.getBalance(clientId)`
- Renvoyer une réponse JSON conforme à l’exemple de la slide.

## Format de sortie

Produire uniquement les modifications de code nécessaires dans le projet NestJS.
Livrables attendus :

- Un controller NestJS `ClientsController` avec base path `clients`
- La route `GET :id/soldes`
- Le câblage de ce controller dans le module existant qui fournit `SoldesService` (dans ce repo : `SoldesModule`).

## Contraintes

- Respecter le périmètre strict de la tâche `id05` (pas de refactor global, pas de nouvelles features).
- Ne pas instancier le service à la main (interdit : `new SoldesService()`), utiliser l’injection Nest via le constructeur.
- Garder le controller “thin” : extraction du paramètre + conversion minimale + appel au service.
- Ne pas introduire de validation avancée (pipes/DTO) : la slide précise que la validation viendra plus tard.
- Respecter les conventions du repo (voir `CODING_RULES.md`) : code simple, typé, organisé par feature.

## Contexte technique

Tâche source :

- `TODO.md` → `id05 Injecter le service dans un controller`

Slide de référence (exigences) :

- `specifications/nestjs-backend-3j/02-demarrage-nestjs/13-code-example-controller-inject-service.yaml`

État actuel du code (repères) :

- Le service existe déjà : `src/soldes/soldes.service.ts` avec `getBalance(clientId: number): number`
- Le module existe déjà et fournit `SoldesService` : `src/soldes/soldes.module.ts`
- L’app importe `SoldesModule` : `src/app.module.ts`

Extrait attendu par la slide (à reproduire au plus proche) :

- `@Controller("clients")`
- `constructor(private readonly soldes: SoldesService) {}`
- `@Get(":id/soldes")`
- Handler qui convertit `id` en `number`, appelle `soldes.getBalance(...)` et renvoie `{ clientId, balance }`.

## Étapes

1. Créer un nouveau controller `ClientsController` (par exemple dans `src/soldes/clients.controller.ts`).
2. Déclarer le controller avec `@Controller('clients')`.
3. Injecter `SoldesService` via le constructeur : `constructor(private readonly soldes: SoldesService) {}`.
4. Ajouter la route : `@Get(':id/soldes')`.
5. Dans le handler :
   - Lire `id` via `@Param('id') id: string`
   - Convertir `id` en `number` (ex: `const clientId = Number(id)`)
   - Appeler `this.soldes.getBalance(clientId)`
   - Retourner `{ clientId, balance }`
6. Enregistrer le controller dans `SoldesModule` (ajouter `ClientsController` à `controllers: [...]`).

## Cas limites (à traiter minimalement)

- Ne pas ajouter de validation/pipes : si `id` est invalide, le comportement actuel du service (throw Error) est acceptable pour cette étape du cours.
- Ne pas changer la signature de `SoldesService.getBalance`.

## Exemples

Appel attendu :

- `GET /clients/1/soldes`

Réponse attendue (d’après la slide) :

```json
{ "clientId": 1, "balance": 0 }
```

## Tests (optionnel)

Aucun test n’est exigé par `id05`. Si tu ajoutes un test, reste minimal :

- Soit un test unitaire du controller via `@nestjs/testing` avec un mock de `SoldesService`.
- Soit un test e2e très simple (si déjà en place dans le chapitre tests), mais ne bloque pas la tâche si ce n’est pas prévu.

## Critères de validation

- L’application compile et démarre.
- `GET /clients/1/soldes` répond `200` avec un JSON contenant exactement `clientId: 1` et `balance: 0` (valeur issue du service).
- Le controller n’instancie jamais `SoldesService` manuellement et délègue bien à `SoldesService.getBalance(...)`.
- Le code reste simple et localisé (pas de refactor non demandé).

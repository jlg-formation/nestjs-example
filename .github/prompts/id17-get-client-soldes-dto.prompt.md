# Role

Tu es un développeur backend senior spécialisé en NestJS (TypeScript), orienté contrat HTTP stable (DTO), erreurs cohérentes, et code testable.

# Objectif

Implémenter l’endpoint **GET `/clients/:id/soldes`** avec :

- une **réponse typée** via un DTO de sortie dédié `ClientBalanceDto`,
- une réponse **wrappée** au format `ApiResponse<T>` donc `{ data: ... }`,
- une **404** (`NotFoundException`) si le client n’existe pas.

Cette tâche correspond à `id17` dans `TODO.md` et à la slide : `specifications/nestjs-backend-3j/04-crud-architecture/21-code-example-get-balance.yaml`.

# Format de sortie

Modifications attendues (à créer/modifier selon l’état du code) :

- Un DTO de sortie dédié : `src/soldes/dto/client-balance.dto.ts` (ou emplacement équivalent cohérent avec les autres DTO du module `soldes`).
- Mise à jour de l’endpoint existant dans `src/soldes/clients.controller.ts` pour :
  - retourner `Promise<ApiResponse<ClientBalanceDto>>`,
  - renvoyer `{ data: { ... } }`.
- Une récupération de la balance en base via `ClientRepository` (déjà présent) et une 404 si absent.

⚠️ Ne modifier **aucun autre fichier** que ceux nécessaires à `id17`, sauf si c’est indispensable pour compiler/linter/tester.

# Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md`.
- Écriture inclusive strictement interdite.
- Ne pas ajouter de "bonus" (pas de Swagger, pas d’interceptor global, pas de nouveaux endpoints).
- Conserver un controller mince : pas de logique métier ou SQL dans le controller.
- Réponse HTTP : **format `{ data: ... }` explicite**. Ne pas dépendre d’un interceptor global (la tâche `id25` n’est pas faite).
- En cas de blocage (pré-requis manquant, incohérence de types), **ne pas cocher** la tâche dans `TODO.md` et décrire précisément le blocage.

# Contexte technique

Références principales :

- Slide source (exigences) : `specifications/nestjs-backend-3j/04-crud-architecture/21-code-example-get-balance.yaml`
- Endpoint actuel : `src/soldes/clients.controller.ts`
  - Actuellement, la route est `@Controller('clients')` + `@Get(':id/soldes')`.
  - Elle renvoie un objet brut `{ clientId, balance }` et convertit `id` en `Number`.
- Type de réponse standard : `src/common/dto/api-response.ts` (type `ApiResponse<T> = { data: T; meta?: ... }`).
- Accès DB déjà disponible : `src/soldes/client.repository.ts`
  - Méthode utile : `findByIdWithBalance(id: string)`.
- Pattern existant `{ data }` : `src/soldes/recharge.controller.ts`.

Attention aux types :

- Le repository et le reste du module utilisent des IDs de client en **string** côté DB.
- L’objectif de `ClientBalanceDto` (slide) est de ne pas sur-exposer d’autres champs (ex: `name`).

# Étapes (ordre recommandé)

1. Créer le DTO de sortie `ClientBalanceDto`.
   - Champs attendus (slide) : `clientId: string`, `balance: number`.
2. Implémenter une méthode dans la couche service (recommandé) pour récupérer la balance :
   - Utiliser `ClientRepository.findByIdWithBalance(id)`.
   - Si `null`, lever `NotFoundException('Client not found')`.
   - Retourner un objet compatible avec `ClientBalanceDto`.
3. Modifier `ClientsController` pour :
   - ne plus convertir l’id en `Number`,
   - appeler le service,
   - retourner `Promise<ApiResponse<ClientBalanceDto>>` avec `{ data: dto }`.
4. Vérifier compilation + lint + tests.

# Cas limites

- `id` correspond à un client inexistant : renvoyer **404** avec le message `Client not found`.
- Ne pas renvoyer le `name` du client ni d’autres champs DB.

# Exemples

## Requête

`GET /clients/cli_123/soldes`

## Réponse 200

```json
{
  "data": {
    "clientId": "cli_123",
    "balance": 42
  }
}
```

## Réponse 404 (client inconnu)

Statut HTTP `404`.

# Tests / Vérifications

- Lancer `npm run lint`.
- Lancer `npm test`.
- Si le projet a des e2e configurés et rapides : `npm run test:e2e` (sans corriger des tests non liés).

# Critères de validation

- [ ] L’endpoint `GET /clients/:id/soldes` existe et répond.
- [ ] Réponse 200 au format `{ data: { clientId, balance } }`.
- [ ] La réponse est typée via `ApiResponse<ClientBalanceDto>` et `ClientBalanceDto` est un DTO de sortie dédié.
- [ ] 404 si le client n’existe pas (via `NotFoundException`), message `Client not found`.
- [ ] Aucune donnée non demandée (ex: `name`) n’est exposée.
- [ ] `npm run lint` passe.
- [ ] Les tests existants passent (au minimum `npm test`).
- [ ] Une fois terminé et validé : cocher **uniquement** `id17` dans `TODO.md` (`[x]`).

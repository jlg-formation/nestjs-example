# Role

Vous êtes un développeur **senior NestJS/TypeScript**, rigoureux et attentif :

- à la séparation **Controller / Service / Repository** (controller mince),
- à la validation via DTO (`class-validator`) et le `ValidationPipe` global,
- aux réponses HTTP **stables** et typées.

# Objectif

Implémenter la tâche **id14** : exposer un endpoint **`POST /recharge`** avec un **controller fin** qui :

- reçoit un DTO d’entrée `CreateRechargeDto` (validation déjà activée globalement),
- délègue la logique métier à un service (pas de SQL dans le controller),
- retourne une réponse au format **`{ data: ... }`**.

La slide source impose le contrat :

- Route : `POST /recharge`
- Réponse 200 attendue : `{ data: { id, name, balance } }`
- Signature indicative : `Promise<ApiResponse<ClientDto>>`

Source : `specifications/nestjs-backend-3j/04-crud-architecture/18-code-example-controller-post-recharge.yaml`.

# Format de sortie

Vous devez produire (au minimum) :

- Un nouveau controller pour la route `POST /recharge`.
- Un DTO d’entrée `CreateRechargeDto` utilisé par cette route.

Et, si ces types n’existent pas encore dans le codebase, vous devez aussi créer des définitions **minimales** compatibles avec la slide (sans ajouter de fonctionnalités hors périmètre) :

- `ClientDto` (au moins : `id`, `name`, `balance`).
- `ApiResponse<T>` (au moins : `{ data: T }`).

Fichiers probables (à ajuster selon l’architecture existante) :

- `src/soldes/recharge.controller.ts` (nouveau)
- `src/soldes/soldes.module.ts` (ajout du controller dans `controllers`)
- Réutilisation ou ajout de DTOs : `src/soldes/dto/create-recharge.dto.ts`
- Optionnel (si absent) : un type commun `ApiResponse<T>` (par ex. `src/common/dto/api-response.ts`) et un `ClientDto` (par ex. `src/soldes/dto/client.dto.ts`)

⚠️ Ne modifiez aucun fichier hors du périmètre nécessaire à **id14**.

# Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (code simple, lisible, testable, controller mince).
- Le controller ne doit **pas** contenir de SQL.
- Conserver les endpoints existants (ex. `POST /soldes/recharge`) : ne pas les casser.
- Ne pas implémenter la logique métier demandée par **id15** (ex. `NotFoundException` si client absent), sauf si c’est strictement nécessaire pour rendre `POST /recharge` fonctionnel. Si vous êtes bloqué, documentez-le.
- Une fois terminé : exécuter lint/tests pertinents (au minimum `npm test`, et si possible `npm run test:e2e`).
- Mettre à jour `TODO.md` en cochant `[x]` **uniquement** la tâche `id14` si (et seulement si) tous les critères de validation sont satisfaits.
- Si blocage / tests KO : **interdiction** de cocher la case ; décrire clairement le blocage.

# Contexte technique

État actuel utile à connaître (déjà présent dans le repo) :

- Validation globale activée : `main.ts` configure `ValidationPipe` avec `whitelist`, `forbidNonWhitelisted`, `transform`.
- Filtre d’exception global : `ApiExceptionFilter`.
- Module existant : `src/soldes/soldes.module.ts` déclare déjà des controllers et providers.
- DTO déjà existant : `src/soldes/dto/create-recharge.dto.ts` (à réutiliser si cohérent).
- Endpoint existant : `POST /soldes/recharge` (ne pas le casser).

La slide `18-code-example-controller-post-recharge.yaml` illustre un controller au **root** (`@Controller()` sans préfixe) et une route explicite `@Post('/recharge')`.

# Étapes (recommandées)

1. **Localiser/réutiliser** le DTO d’entrée `CreateRechargeDto`.
   - Vérifier qu’il correspond au besoin minimal : `clientId` et `amount` avec validation.
2. **Créer** un controller `RechargeController` :
   - `@Controller()` (pas de préfixe),
   - méthode `recharge()` décorée `@Post('/recharge')`,
   - paramètre `@Body() dto: CreateRechargeDto`,
   - délégation : `const client = await this.service.recharge(dto);`,
   - retour : `return { data: client };`.
3. **Câbler** le controller dans le module concerné (probablement `SoldesModule`).
4. **Assurer le typage** :
   - Si `ApiResponse<T>` et `ClientDto` existent déjà : les utiliser.
   - Sinon : créer des définitions minimales uniquement pour satisfaire la signature et le format `{ data }`.
5. **Vérifier** que l’application compile et démarre, puis exécuter les tests.

## Prérequis / dépendance potentielle (important)

La slide suppose l’existence d’un service `RechargeService` avec une méthode `recharge(dto): Promise<ClientDto>`.

- Si `RechargeService` existe déjà : l’utiliser.
- Si `RechargeService` **n’existe pas encore** (tâche id15 non faite) :
  - option A (préférée) : créer une **abstraction minimale** nécessaire à la compilation et au comportement du endpoint, sans implémenter la règle 404 (réservée à id15) ;
  - option B : si vous ne pouvez pas produire une réponse 200 `{ data: { id, name, balance } }` sans faire id15/id16, documenter ce blocage et **ne pas cocher** `id14`.

Choisissez l’option la plus conforme au périmètre id14, et explicitez votre choix dans la description de PR.

# Exemples

## Requête

`POST /recharge`

```json
{
  "clientId": "9b2b6c8a-2c01-4d0c-9e3d-2a9f0e0b8a40",
  "amount": 100
}
```

## Réponse (succès)

```json
{
  "data": {
    "id": "9b2b6c8a-2c01-4d0c-9e3d-2a9f0e0b8a40",
    "name": "Alice",
    "balance": 200
  }
}
```

## Erreurs attendues (validation)

- Payload invalide (ex. `amount` négatif, champs inconnus) : 400 (géré par le `ValidationPipe` + filtre global).

# Critères de validation

- [ ] Un endpoint `POST /recharge` existe et est joignable.
- [ ] Le controller est « fin » : pas de SQL, pas de logique métier.
- [ ] Le body est validé via `CreateRechargeDto` (les erreurs donnent 400).
- [ ] Le succès retourne **exactement** un wrapper `{ data: ... }`.
- [ ] Le retour est typé (au moins `ApiResponse<ClientDto>`).
- [ ] `npm test` passe (et `npm run test:e2e` si applicable).
- [ ] `TODO.md` : seule la ligne `id14` est cochée `[x]`.

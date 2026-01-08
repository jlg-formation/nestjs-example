# id04 — SoldesService Injectable (getBalance)

## Role

Tu es un·e développeur·euse **NestJS / TypeScript** expérimenté·e. Tu appliques les bonnes pratiques Nest (**fat service, thin controller**) et tu respectes les conventions du repo.

## Objectif

Implémenter la logique métier **hors HTTP** dans un service NestJS.

Livrer un service `SoldesService` décoré avec `@Injectable()` exposant une méthode :

- `getBalance(clientId: number): number`

Conformément à la slide, la méthode doit :

- refuser un `clientId` invalide (≤ 0) en lançant `new Error("Invalid clientId")`
- retourner `0` (valeur dummy à ce stade) pour un `clientId` valide

## Format de sortie

Modifier uniquement le code applicatif (pas de refacto large) :

- Mettre à jour `src/soldes/soldes.service.ts` pour contenir l’implémentation complète du service.

Optionnel (uniquement si tu juges que c’est strictement nécessaire et minimal) :

- Ajouter/compléter un test unitaire dans `src/soldes/soldes.service.spec.ts` pour couvrir le cas OK/KO de `getBalance`.

## Contraintes

- Ne pas ajouter de fonctionnalités “bonus” (pas de DB, pas de DTO, pas d’exceptions Nest à ce stade).
- Le service doit rester **indépendant de HTTP** : pas de `@Controller`, pas de `@Req/@Res`, pas de dépendance Express.
- Respecter les conventions du repo (voir `CODING_RULES.md`) : simplicité, typage clair, changements locaux.
- Utiliser `Error` pour les erreurs métier **pour l’instant** (on migrera vers des exceptions Nest plus tard).

## Contexte technique

- Service actuel (généré précédemment) : `src/soldes/soldes.service.ts` (actuellement vide).
- Controller existant : `src/soldes/soldes.controller.ts` (ne pas le modifier pour cette tâche).

Référence slide : `specifications/nestjs-backend-3j/02-demarrage-nestjs/11-code-example-service-injectable.yaml`

Snippet attendu (adapté au style du repo) :

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SoldesService {
  getBalance(clientId: number): number {
    if (clientId <= 0) throw new Error('Invalid clientId');
    return 0;
  }
}
```

## Étapes (recommandées)

1. Ouvrir `src/soldes/soldes.service.ts`.
2. Vérifier que `@Injectable()` est présent (sinon l’ajouter).
3. Implémenter `getBalance(clientId: number): number` avec la garde `clientId <= 0`.
4. S’assurer que le service ne fait aucune logique HTTP et ne dépend que de code métier.
5. (Optionnel) Ajouter un test minimal :
   - `expect(() => service.getBalance(0)).toThrow('Invalid clientId')`
   - `expect(service.getBalance(1)).toBe(0)`

## Cas limites

- `clientId = 0` → doit lever `Error("Invalid clientId")`
- `clientId < 0` → doit lever `Error("Invalid clientId")`
- `clientId > 0` → doit retourner `0`

## Critères de validation

- `SoldesService` est décoré avec `@Injectable()`.
- La méthode `getBalance(clientId: number): number` existe et est typée correctement.
- `clientId <= 0` déclenche `throw new Error('Invalid clientId')` (message exact).
- Pour un `clientId` valide, la méthode retourne `0`.
- Aucun code HTTP n’apparaît dans le service.
- `npm test` reste au vert (au minimum, les tests existants passent).

````markdown
# id06 — Déclarer controllers/providers dans un module dédié

## Role

Tu es un développeur backend senior NestJS/TypeScript. Tu maîtrises l’assemblage par module (`@Module`) et l’injection de dépendances Nest (controllers/providers).

## Objectif

Mettre en place (ou corriger) un module Nest dédié à la feature “soldes” afin que Nest puisse :

- Instancier les controllers de la feature
- Instancier le service injectable
- Injecter le service dans les controllers

Livrable annoncé par la tâche : `SoldesModule` câblé.

## Format de sortie

Produire uniquement les modifications de code nécessaires dans le projet NestJS.

Livrables attendus :

- Un module `SoldesModule` utilisant `@Module({ controllers: [...], providers: [...] })`
- Les imports corrects des classes (controller(s) et service)
- L’application importe le module (via `AppModule`) si ce n’est pas déjà le cas

## Contraintes

- Respecter strictement le périmètre de la tâche `id06` : câbler un module (pas de nouvelles routes, pas de refactor global).
- Ne pas ajouter de logique métier dans le module (un module assemble seulement).
- Rester aligné avec les conventions du repo (voir `AGENTS.md` puis `CODING_RULES.md`) : code simple, idiomatique, testable.
- Ne pas introduire de validation/DTO/pipes (ce sera traité plus tard dans le cours).

## Contexte technique

Tâche source :

- `TODO.md` → `id06 Déclarer controllers/providers dans un module dédié`

Slide de référence (exigences) :

- `specifications/nestjs-backend-3j/02-demarrage-nestjs/14-code-example-module-wire.yaml`

Extrait attendu par la slide (à reproduire au plus proche, en respectant le formatage Prettier du repo) :

```ts
import { Module } from '@nestjs/common';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController],
  providers: [SoldesService],
})
export class SoldesModule {}
```

Résultat attendu par la slide :

- “Nest peut instancier et injecter `SoldesService`”

## Étapes

1. Créer ou mettre à jour le fichier de module de la feature (cible typique : `src/soldes/soldes.module.ts`).
2. Importer `Module` depuis `@nestjs/common`.
3. Importer `SoldesController` et `SoldesService` depuis les fichiers de la feature.
4. Déclarer `@Module({ controllers: [...], providers: [...] })` avec au minimum :
   - `controllers: [SoldesController]`
   - `providers: [SoldesService]`
5. Vérifier que `AppModule` importe `SoldesModule` (ex: `imports: [SoldesModule]`). Si ce n’est pas le cas, l’ajouter.
6. Vérifier que l’app démarre et que l’injection fonctionne (au minimum : compilation OK).

## Cas limites

- Ne pas ajouter d’exports/imports inutiles : à ce stade, le module sert uniquement à déclarer controllers/providers.
- Si le codebase contient déjà d’autres controllers de la feature “soldes” (par ex. un controller “clients” créé à l’étape précédente du cours), ne pas en inventer. Inclure uniquement ce qui existe déjà et qui doit être instancié par Nest pour la feature.

## Tests (optionnel)

Aucun test n’est exigé par `id06`. Si tu en ajoutes un, rester minimal et ne pas bloquer la tâche.

## Critères de validation

- `SoldesModule` existe et déclare au minimum : `controllers: [SoldesController]` et `providers: [SoldesService]`.
- L’application compile et démarre.
- Nest est capable d’instancier `SoldesService` et de l’injecter dans les controllers qui en dépendent.
````

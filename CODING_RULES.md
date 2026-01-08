# Coding rules (NestJS / TypeScript)

Ce document fixe les conventions de code pour ce repository de cours. Objectif : un code **cohérent**, **lisible**, **testable** et facile à faire évoluer au fil des slides.

## 1) Principes

- Préférer la **simplicité** (KISS) et les changements incrémentaux.
- Éviter le “magic” et les abstractions prématurées (YAGNI).
- Un fichier/une classe = une responsabilité claire.
- Les controllers restent **minces** (“fat service, thin controller”).

## 2) Outillage obligatoire

- Formatage : `npm run format` (Prettier).
- Lint : `npm run lint` (ESLint). Corriger les warnings quand c’est raisonnable.
- Tests : `npm test`, `npm run test:e2e`.

Règles ESLint notables :

- `@typescript-eslint/no-floating-promises` est en `warn` : **toujours** `await` ou `return` les Promises.
- `@typescript-eslint/no-explicit-any` est désactivée : `any` est toléré ponctuellement, mais **à éviter** (voir §4).

## 3) Organisation du code NestJS

### Rôles

- **Module** : assemble (imports/providers/controllers/exports). Pas de logique métier.
- **Controller** : expose l’API HTTP (routing, validation, mapping minimal). Pas de règles métier.
- **Service** : logique métier, orchestration, règles, appels à la data-layer.

### Structure de dossiers

- Préférer une structure “par fonctionnalité” (feature-first) quand le projet grandit.
- Garder `src/app.*` minimal, et ajouter des modules dédiés (ex: `src/users/`, `src/products/`).

### Injection de dépendances

- Utiliser l’injection Nest (`constructor(private readonly x: XService) {}`), pas de singletons maison.
- Les providers doivent être testables : éviter les accès statiques globaux.

## 4) Conventions TypeScript

- Types > runtime : typer les entrées/sorties et garder les conversions explicites.
- `any` :
  - accepté uniquement si temporaire / bloquant,
  - préférer `unknown` + narrowing,
  - documenter via le nom (ex: `payloadUnknown`) plutôt que commentaires.
- Favoriser `readonly` quand applicable.
- Éviter les assertions non-null (`!`) sauf cas très justifié.
- Fonctions publiques (service/controller) : retour typé (au moins implicitement), éviter `Promise<any>`.

## 5) Conventions de nommage

- Fichiers : `kebab-case` (ex: `users.controller.ts`, `create-user.dto.ts`).
- Classes : `PascalCase`.
- Variables/fonctions : `camelCase`.
- DTO : suffixe `Dto` (ex: `CreateUserDto`).
- Tests : `*.spec.ts`.

## 6) API HTTP (controllers)

- Les controllers ne contiennent que :
  - routage (`@Get`, `@Post`, …),
  - extraction des paramètres (`@Param`, `@Query`, `@Body`),
  - validation/transform minimal (via pipes),
  - appel au service.
- Codes HTTP :
  - utiliser des exceptions Nest (`BadRequestException`, `NotFoundException`, …),
  - éviter de renvoyer des codes “à la main” dans la logique métier.
- Ne pas attraper une erreur pour la masquer : si on `catch`, c’est pour **transformer** / **enrichir** proprement.

## 7) Validation et DTO

Quand la validation sera introduite dans les slides :

- Valider les entrées via DTO + `ValidationPipe` (global ou au niveau route).
- Ne pas exposer directement des objets “data-layer” bruts en sortie si ça fuite des champs non voulus.

## 8) Accès aux données (SQL / autres)

Quand une couche DB sera ajoutée :

- Isoler l’accès aux données dans une couche dédiée (repository/gateway/service DB).
- Toujours utiliser des requêtes **paramétrées** (jamais de concat SQL).
- Centraliser la configuration DB (module/config), pas de credentials en dur.

## 9) Gestion d’erreurs et logs

- Erreurs attendues côté API : lever une exception Nest adaptée.
- Logs : utiliser `Logger` Nest (pas de `console.log` dans le code applicatif).

## 10) Tests

- Tests unitaires : viser surtout les services.
  - isoler via mocks (pas de dépendance réseau/DB en unit).
- E2E : valider l’intégration HTTP.
- Pattern : Arrange / Act / Assert.
- Écrire des tests lisibles : nommer clairement le “given/when/then”.

## 11) Refactoring

- Refactor petit à petit : un changement = un objectif.
- Ne pas “reformatter” tout un fichier si le changement est local.
- Si une API est utilisée ailleurs, préserver le contrat ou adapter les usages dans la même PR.

---

Si une règle bloque l’avancement pendant le cours, on privilégie un contournement **simple** et on revient dessus au slide suivant (mais on évite de laisser des dettes invisibles).

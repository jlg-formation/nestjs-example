# id19 — Tester un controller via TestingModule avec service mocké

## Role

Tu es un développeur backend senior NestJS/TypeScript, orienté tests. Tu écris des tests unitaires lisibles, stables, sans accès DB, et tu respectes les conventions du repository.

## Objectif

Implémenter un **test unitaire de controller** avec `@nestjs/testing` en construisant un `TestingModule` et en **injectant un service mocké via `useValue`**.

Le test doit valider le **contrat du controller** (appel du service + forme de la réponse HTTP côté controller), sans toucher à la base de données.

Tâche ciblée (TODO): `id19 Tester un controller via TestingModule avec service mocké — Livrable: test unitaire controller + useValue`.

## Format de sortie

- Créer un fichier de test unitaire pour le controller choisi (recommandé : le controller `RechargeController`) :
  - `src/soldes/recharge.controller.spec.ts`
- Si un fichier de test existe déjà pour ce controller, le compléter au lieu d’en créer un nouveau.
- Mettre à jour `TODO.md` en cochant **uniquement** `id19` une fois que les tests passent.

## Contraintes

- Ne pas implémenter de feature bonus.
- Ne pas dépendre de la DB (pas de repository réel, pas de transaction, pas de MariaDB).
- Utiliser `@nestjs/testing` et un `TestingModule` (pas d’instanciation manuelle du controller).
- Remplacer la dépendance du controller par un mock injecté via `useValue`.
- Respecter `AGENTS.md` et `CODING_RULES.md` (code simple, tests Arrange/Act/Assert, controllers minces).
- Si quelque chose bloque (erreurs TypeScript, dépendances manquantes, test instable), **ne pas cocher** `id19` et décrire clairement le blocage.

## Contexte technique

Référence slide: `specifications/nestjs-backend-3j/05-tests/10-code-example-testing-module.yaml`

Exemple attendu (principe) :

- Créer le module de test :
  - `Test.createTestingModule({ controllers: [...], providers: [{ provide: Service, useValue: mock }] }).compile()`
- Récupérer le controller via `moduleRef.get(Controller)`.

Code existant utile dans ce repo :

- Controller à tester (recommandé) : `src/soldes/recharge.controller.ts`
  - Route: `POST /recharge`
  - Appelle `this.service.recharge(dto)` et renvoie `{ data: client }`
- Service dépendance : `src/soldes/recharge.service.ts` (à mocker dans le test)
- Exemple de test similaire déjà présent : `src/soldes/soldes.controller.spec.ts`

## Étapes (ordre recommandé)

1. Créer (ou ouvrir) le test `src/soldes/recharge.controller.spec.ts`.
2. Définir un mock de service minimal, avec `jest.fn()` et un typage simple.
   - Recommandation : typer le mock comme `Pick<RechargeService, 'recharge'>` (ou équivalent) pour éviter `any`.
3. Construire un `TestingModule` avec `controllers: [RechargeController]`.
4. Fournir le provider du service avec `useValue: serviceMock`.
5. Récupérer une instance du controller via `module.get(RechargeController)`.
6. Écrire les tests :
   - `should be defined`
   - un test qui vérifie :
     - que `RechargeController.recharge(dto)` appelle le service avec le DTO
     - que la valeur de retour est bien au format `{ data: <ClientDto> }`
7. Exécuter les tests unitaires : `npm test`.
8. Si tout est OK, cocher uniquement `id19` dans `TODO.md`.

## Exemples (guides)

### Exemple de mock (idée)

- `const serviceMock = { recharge: jest.fn() }`
- `serviceMock.recharge.mockResolvedValue(<ClientDto>)`

### Exemple de cas à tester (pour RechargeController)

- Arrange: un DTO d’entrée, ex: `{ clientId: 'abc', amount: 100 }`
- Arrange: un `ClientDto` de sortie, ex: `{ id: 'abc', balance: 100 }` (adapter aux champs réels du DTO)
- Act: `await controller.recharge(dto)`
- Assert:
  - `expect(serviceMock.recharge).toHaveBeenCalledWith(dto)`
  - `expect(result).toEqual({ data: clientDto })`

## Critères de validation

- Le test utilise `Test.createTestingModule()` et `useValue` pour injecter le mock (pas d’accès DB).
- Le test compile et passe avec `npm test`.
- Le test vérifie au minimum :
  - que le controller est défini
  - que le controller appelle le service mocké
  - que le controller renvoie une réponse conforme au contrat `{ data: ... }`.
- `TODO.md` : seule la case `id19` est cochée (et uniquement si les tests passent).

# Role

Tu es un développeur backend senior spécialisé en NestJS (TypeScript), avec une excellente maîtrise de la DI, des exceptions HTTP Nest, et de la structuration controller/service/repository.

# Objectif

Implémenter (ou corriger) `RechargeService` pour porter la logique métier de recharge et mapper le cas « client absent » vers une exception HTTP Nest **404** via `NotFoundException`.

La règle métier principale attendue par la slide :

- Si `clientId` n’existe pas, l’API doit répondre en **404** avec un message lisible (ex: `Client not found`).

# Format de sortie

Les modifications attendues portent sur le code applicatif et éventuellement un test minimal :

- Fichier service : `src/soldes/recharge.service.ts`
- (Optionnel mais recommandé si aucun test ne couvre ce service) ajouter un test unitaire : `src/soldes/recharge.service.spec.ts`
- Mise à jour du suivi : cocher uniquement `id15` dans `TODO.md` si et seulement si tout est terminé et les tests passent.

# Contraintes

- Ne pas traiter le chapitre `01-typescript-mini-express`.
- Respecter `AGENTS.md` puis `CODING_RULES.md` (simplicité, controller mince, service testable).
- Ne pas implémenter la tâche suivante `id16` : pas de refactor transactionnel complet du repository.
  - Si tu es tenté d’introduire une méthode transactionnelle du type `applyRecharge(...)`, limite-toi au strict nécessaire pour `id15`.
- Conserver le contrat HTTP existant pour `POST /recharge` (réponse `{ data: ... }` gérée par `RechargeController`).
- En cas de blocage (exigence manquante, tests en échec sans lien direct), **ne coche pas** `id15` et documente clairement le blocage.

# Contexte technique

Références (slide source de la tâche) :

- `specifications/nestjs-backend-3j/04-crud-architecture/19-code-example-service-recharge.yaml`

État actuel du code (repères) :

- Le controller de la route cible est `src/soldes/recharge.controller.ts` (route `POST /recharge`, réponse `ApiResponse<ClientDto>` avec `{ data }`).
- Le service actuel est `src/soldes/recharge.service.ts`.
- Les accès DB existants sont dans :
  - `src/soldes/client.repository.ts` (ex: `findByIdWithBalance`)
  - `src/soldes/recharge.repository.ts` (ex: `insertRecharge`, `incrementBalance`)

Attendu par la slide (à reproduire au niveau comportement) :

- Service `@Injectable()`.
- Orchestration : le service délègue l’exécution SQL au(x) repository(ies).
- Si le client n’existe pas : lever `NotFoundException('Client not found')` (ou message équivalent, mais garder la même intention).

# Étapes

1. Mettre `RechargeService` en conformité avec la slide
   - Remplacer l’exception actuelle (si ce n’est pas déjà le cas) par `NotFoundException` quand le client est absent.
   - Vérifier le client avant d’appliquer la recharge (tu peux utiliser `ClientRepository.findByIdWithBalance` si c’est l’API disponible).
   - Garder le service testable (pas de logique SQL directe dans le service).

2. Vérifier le comportement HTTP côté API
   - `POST /recharge` avec un `clientId` inconnu doit conduire à une réponse 404 (via l’exception Nest).
   - Ne pas modifier le format de succès du controller : il renvoie `{ data: client }`.

3. (Recommandé) Couvrir la règle 404 par un test unitaire
   - Créer `src/soldes/recharge.service.spec.ts` sur le modèle des autres tests unitaires du repo.
   - Cas minimum : `recharge()` rejette avec `NotFoundException` si `ClientRepository.findByIdWithBalance(...)` renvoie `null`.
   - Vérifier aussi que les repositories de recharge ne sont pas appelés quand le client est absent.

4. Exécuter les vérifications locales
   - `npm test`
   - (si pertinent dans ton environnement) `npm run test:e2e`

5. Mettre à jour `TODO.md`
   - Si tout est OK : cocher uniquement `[x] id15 ...`.
   - Sinon : ne rien cocher et décrire clairement le problème.

# Cas limites

- Le client existe au début mais n’est plus retrouvable après la mise à jour :
  - Rester cohérent et renvoyer une erreur explicite (au minimum `NotFoundException` avec le même message).
- Ne pas ajouter de validation métier sur `amount` si la validation DTO la couvre déjà (éviter le doublon).

# Critères de validation

- `RechargeService` lève `NotFoundException` quand `clientId` est inconnu.
- L’API renvoie un statut HTTP **404** pour ce cas (via la mécanique d’exceptions Nest).
- Le service reste une orchestration (pas de SQL dans le service).
- Les tests `npm test` passent.
- `TODO.md` : seule la tâche `id15` est cochée, et uniquement si tout est validé.

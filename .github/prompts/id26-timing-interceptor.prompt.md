# id26 — Timing interceptor

## Role

Tu es un développeur NestJS senior (TypeScript) orienté qualité et cohérence d’API. Tu respectes strictement les conventions du repository (voir `AGENTS.md` et `CODING_RULES.md`) et tu implémentes une solution minimale, testable et propre.

## Objectif

Ajouter un interceptor NestJS `TimingInterceptor` qui mesure le temps d’exécution (en ms) de chaque requête HTTP et écrit un log de performance.

Référence slide : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/15-code-example-interceptor-timing.yaml`.

## Format de sortie

Produire uniquement ce qui est nécessaire pour la tâche :

- Un nouvel interceptor : `src/common/interceptors/timing.interceptor.ts`
- Câblage global de l’interceptor (au même niveau que `WrapResponseInterceptor`) dans `src/app.module.ts`

En fin de tâche, mettre à jour `TODO.md` en cochant `[x]` uniquement `id26`.

## Contraintes

- Ne pas ajouter de fonctionnalités bonus (pas de métriques externes, pas de Prometheus, pas de corrélation ID, etc.).
- Respecter `CODING_RULES.md` : pas de `console.log` dans le code applicatif, utiliser `Logger` de Nest.
- Garder le code simple (KISS), sans abstractions prématurées.
- Ne cocher `TODO.md` que si : format/lint OK et tests OK.
- Si blocage (exigence ambiguë, conflit, tests KO), ne pas cocher la case et décrire clairement le problème.

## Contexte technique

- Tâche `id26` (TODO) : “Ajouter un interceptor de timing (ms par requête) — Livrable: `TimingInterceptor`”.
- Slide YAML : exemple d’un interceptor qui fait un `Date.now()` avant, puis un `tap(...)` après `next.handle()` pour logguer `method`, `originalUrl` et la durée.
- Interceptor global déjà présent : `WrapResponseInterceptor` dans `src/common/interceptors/wrap-response.interceptor.ts`.
- Câblage global actuel : `src/app.module.ts` utilise `APP_INTERCEPTOR` pour `WrapResponseInterceptor`.

## Étapes

1. Créer `TimingInterceptor` dans `src/common/interceptors/timing.interceptor.ts`.
   - Implémenter `NestInterceptor`.
   - Dans `intercept(context, next)` :
     - capturer `start = Date.now()`.
     - récupérer la requête HTTP via `context.switchToHttp().getRequest()`.
     - retourner `next.handle().pipe(tap(() => ...))`.
   - Log attendu (proche de la slide) : `handled <METHOD> <URL> in <ms>ms`.
   - Utiliser `Logger` Nest (ex: `private readonly logger = new Logger(TimingInterceptor.name)`), pas `console.log`.

2. Brancher l’interceptor globalement dans `src/app.module.ts`.
   - Ajouter un provider `APP_INTERCEPTOR` supplémentaire pour `TimingInterceptor`.
   - Vérifier que `WrapResponseInterceptor` continue de wrapper les réponses en `{ data }`.

3. Vérifier la cohérence d’exécution.
   - S’assurer que l’interceptor loggue bien après l’exécution du handler (après `next.handle()`), comme dans la slide.
   - S’assurer que l’interceptor ne modifie pas le body de réponse (aucun `map` ici, uniquement `tap`).

4. Valider via outillage.
   - `npm run format`
   - `npm run lint`
   - `npm test`
   - `npm run test:e2e`

5. Mettre à jour `TODO.md`.
   - Cocher `[x]` uniquement la ligne `id26` si tout est OK.

## Cas limites

- L’interceptor doit fonctionner quel que soit l’endpoint (GET/POST) et ne pas supposer un DTO particulier.
- Ne pas crasher si certaines propriétés de la requête ne sont pas présentes : privilégier `req.method` et `req.originalUrl` (ou fallback sur `req.url` si nécessaire, sans complexifier).
- Ne pas attraper d’erreur pour la masquer : l’interceptor ne doit pas transformer les exceptions.

## Critères de validation

- `TimingInterceptor` existe et est injectable (`@Injectable()`).
- L’interceptor est appliqué globalement (au même titre que `WrapResponseInterceptor`).
- Un appel HTTP produit un log contenant : méthode, URL, durée en ms.
- Le formatage et le lint passent : `npm run format` + `npm run lint`.
- Les tests passent : `npm test` et `npm run test:e2e`.
- `TODO.md` : seule la case `id26` est cochée (pas d’autres modifications).

# id23 — Middleware logger (method + URL + status + durée)

## Role

Tu es un développeur backend senior NestJS/TypeScript. Tu appliques strictement les conventions de ce repository (voir `AGENTS.md` puis `CODING_RULES.md`).

## Objectif

Implémenter un middleware NestJS `LoggerMiddleware` qui logge, pour chaque requête HTTP :

- la méthode HTTP
- l’URL (route)
- le status HTTP final
- la durée en millisecondes

Puis le brancher globalement à l’application (toutes les routes).

Source fonctionnelle (slide) : `specifications/nestjs-backend-3j/06-middleware-guards-interceptors-swagger/06-code-example-middleware-logger.yaml`.

## Format de sortie

Livrer uniquement ce qui est nécessaire pour la tâche :

- Un middleware injectable `LoggerMiddleware`.
- Son branchement sur l’application (global).

Fichiers attendus (suggestion de placement, à adapter si le repo a déjà une convention) :

- `src/common/middleware/logger.middleware.ts`
- Mise à jour de `src/app.module.ts` pour enregistrer le middleware.

## Contraintes

- Ne pas traiter d’autres tâches que `id23`.
- Ne pas ajouter de “bonus” (pas de correlation-id, pas de niveaux de logs avancés, pas de filtrage, pas de swagger/guard/interceptor).
- Respecter `CODING_RULES.md` : utiliser le logger NestJS (`Logger`) plutôt que `console.log` dans le code applicatif.
- Typage TypeScript propre : éviter `any` si possible (utiliser `Request/Response/NextFunction` d’Express).
- Le log doit être émis quand la réponse est terminée, pour avoir le status final (`finish`).
- Une fois la tâche réellement terminée et validée, mettre à jour `TODO.md` en cochant `[x]` uniquement `id23`. Si blocage ou tests KO, ne pas cocher et expliquer clairement.
- Écriture inclusive interdite.

## Contexte technique

État actuel notable :

- Le module racine est `src/app.module.ts` et importe `SoldesModule`.
- Le bootstrap est dans `src/main.ts` (pipes/filters globaux déjà en place).
- Il existe déjà `src/common/filters/api-exception.filter.ts` mais pas encore de dossier `middleware`.

Référence slide (comportement attendu) :

- Mesurer un `start = Date.now()` au début.
- Écouter `res.on('finish', ...)`.
- Logger : `${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`.

## Étapes

1. Créer le fichier `src/common/middleware/logger.middleware.ts`.
   - `LoggerMiddleware` doit implémenter `NestMiddleware`.
   - `use(req, res, next)` doit :
     - capturer `Date.now()` au début
     - sur `res.on('finish', ...)`, calculer `ms` et logger une ligne au format de la slide
     - appeler `next()`.
   - Utiliser `Logger` de `@nestjs/common` (ex: `private readonly logger = new Logger(LoggerMiddleware.name);`).
   - Utiliser les types Express :
     - `import type { Request, Response, NextFunction } from 'express';`
     - signature `use(req: Request, res: Response, next: NextFunction): void`.

2. Enregistrer le middleware globalement.
   - Option recommandée : dans `src/app.module.ts`, faire implémenter `NestModule` à `AppModule` et enregistrer via `configure(consumer: MiddlewareConsumer)`.
   - Brancher sur toutes les routes (exemples acceptables) :
     - `consumer.apply(LoggerMiddleware).forRoutes('*')`
     - ou `consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })`
   - Importer `LoggerMiddleware` avec un chemin cohérent.

3. Validation locale.
   - Démarrer l’app et appeler un endpoint existant (ex: `GET /soldes/ping` ou autre route déjà présente).
   - Vérifier qu’une ligne de log est produite avec : méthode, URL, status, durée.
   - Vérifier que le status loggé correspond au status final (ex: 400/404 doivent être loggés correctement).

4. Finalisation.
   - Si tout est OK, cocher uniquement `id23` dans `TODO.md`.

## Critères de validation

Checklist de succès :

- `LoggerMiddleware` existe, est injectable, et logge sur l’événement `finish`.
- Le message contient bien : méthode + URL + status + durée `(xxms)`.
- Le middleware est branché globalement (toutes les routes).
- Le code respecte les conventions : pas de `console.log` dans le middleware, pas de `any` gratuit.
- `TODO.md` : seule la case `id23` est cochée, et uniquement après validation.

## Cas limites

- Route qui retourne une erreur (400/404/500) : le log doit afficher le status final.
- Requêtes rapides : la durée peut être `0ms`, c’est acceptable.

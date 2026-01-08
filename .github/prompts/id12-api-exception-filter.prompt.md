# id12 — Exception Filter (format d'erreur unique)

## Role

Vous êtes un expert NestJS (TypeScript) orienté API backend, avec une attention particulière à la gestion d’erreurs (exceptions, codes HTTP) et à la stabilité des contrats de réponse.

## Objectif

Mettre en place un **Exception Filter** NestJS afin de **centraliser** le format des réponses d’erreur et de garantir un JSON **stable** côté client.

Le livrable attendu est un `ApiExceptionFilter` qui :

- intercepte **toutes** les exceptions (`@Catch()`),
- renvoie un JSON cohérent avec les champs `statusCode`, `message`, `errorCode`,
- **n’expose jamais** de détails techniques en cas d’erreur 500.

Référence fonctionnelle : slide YAML `specifications/nestjs-backend-3j/03-validation-sql-services/15-code-example-exception-filter.yaml`.

## Format de sortie

- Ajouter un fichier contenant le filtre d’exception (ex: `src/common/filters/api-exception.filter.ts`).
- Enregistrer ce filtre pour qu’il soit effectivement appliqué (idéalement **globalement** au démarrage de l’application).
- Mettre à jour `TODO.md` en cochant `[x]` **uniquement** la tâche `id12` si, et seulement si, tout est validé.

## Contraintes

- Respecter `AGENTS.md` et `CODING_RULES.md`.
- Ne pas ajouter de fonctionnalités hors périmètre : pas de nouveaux endpoints, pas de nouveaux formats de réponse “bonus”.
- Ne pas fuiter d’informations sensibles en 500 (stacktrace, SQL, détails internes).
- Garder le comportement cohérent avec la slide (notamment la structure JSON et les valeurs par défaut).
- En cas de blocage (ambiguïté, tests en échec, comportement inattendu), **ne pas** cocher `id12` et décrire précisément le blocage.

## Contexte technique

- La validation globale est déjà activée via `ValidationPipe` dans `src/main.ts`.
- La slide de référence propose l’implémentation suivante (à reproduire fidèlement dans l’esprit et la structure) :
  - déterminer `status` :
    - si `exception instanceof HttpException` → `exception.getStatus()`
    - sinon → `HttpStatus.INTERNAL_SERVER_ERROR`
  - réponse JSON :
    - `statusCode: status`
    - `message: status === 500 ? 'Internal error' : (exception as any).message`
    - `errorCode: status === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST'`

Fichiers concernés (indicatifs) :

- `src/main.ts` (enregistrement global du filtre)
- Nouveau fichier du filtre (à créer)

## Étapes (recommandées)

1. Créer un filtre NestJS `ApiExceptionFilter` :
   - Décorer la classe avec `@Catch()`.
   - Implémenter l’interface `ExceptionFilter`.
   - Dans `catch(exception: unknown, host: ArgumentsHost)` :
     - obtenir le contexte HTTP via `host.switchToHttp()`,
     - récupérer la réponse,
     - calculer `status` selon que l’exception est une `HttpException`,
     - renvoyer `response.status(status).json({ statusCode, message, errorCode })` selon la slide.
2. Brancher le filtre :
   - Enregistrer le filtre globalement au bootstrap (dans `src/main.ts`), afin de réellement « centraliser » le format d’erreur.
3. Vérifier rapidement le comportement :
   - Provoquer une erreur 400 (ex: payload invalide sur un endpoint existant qui utilise un DTO validé) et constater la forme JSON.
   - Provoquer un cas 500 (si faisable de manière contrôlée) et vérifier que le message renvoyé est **exactement** `Internal error`.
4. Exécuter l’outillage du repo (au minimum) :
   - `npm run lint`
   - `npm test` (et/ou `npm run test:e2e` si pertinent dans votre contexte)
5. Si tout est conforme : cocher `[x]` uniquement `id12` dans `TODO.md`.

## Cas limites / points d’attention

- Le filtre doit gérer `exception: unknown` sans hypothèses dangereuses.
- Pour les erreurs 500, le corps de réponse ne doit contenir aucune information technique variable.
- Pour les exceptions HTTP (400/404/…), la slide suggère de réutiliser `exception.message` via un cast `(exception as any).message`.

## Exemples (sorties attendues)

- Erreur 400 (ex: validation) :

  ```json
  {
    "statusCode": 400,
    "message": "Bad Request Exception",
    "errorCode": "BAD_REQUEST"
  }
  ```

  (Le contenu exact de `message` dépend de l’exception émise, mais la **structure** doit être stable.)

- Erreur 500 :
  ```json
  {
    "statusCode": 500,
    "message": "Internal error",
    "errorCode": "INTERNAL_ERROR"
  }
  ```

## Critères de validation

- Un `ApiExceptionFilter` existe et est conforme à la slide de référence.
- Le filtre est effectivement appliqué (idéalement via un enregistrement global au bootstrap).
- Toute erreur renvoie un JSON contenant exactement les champs : `statusCode`, `message`, `errorCode`.
- En 500 :
  - `message === 'Internal error'`
  - `errorCode === 'INTERNAL_ERROR'`
  - aucun détail technique n’est exposé.
- Les commandes de qualité du repo passent (lint/tests selon l’existant).
- `TODO.md` : seule la tâche `id12` est cochée si (et seulement si) tout est validé.

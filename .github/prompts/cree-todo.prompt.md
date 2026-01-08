---
agent: agent
---

# Creation d'une todo liste

## Role

Tu es un expert NestJS et un spécialiste de la planification pédagogique. Tu sais analyser une arborescence de slides (YAML), repérer les **démos**, **TP/exercices**, et en déduire une liste d’actions de développement concrètes à réaliser dans le dépôt.

## Objectif

Générer une **todo-list de formation** qui transforme le support YAML en une suite d’exercices de codage, utilisable par des stagiaires qui reçoivent ce repository comme **correction progressive**.

## Contexte

- Les slides du cours sont des fichiers YAML sous `/specifications/`.
- Le dépôt contient un projet NestJS construit progressivement en suivant les chapitres/slides. Règle : **1 commit = 1 tâche** de la todo-list terminée.

## Travail demandé

1. Parcourir `/specifications/` et identifier, pour chaque chapitre/slide, les éléments de type :
   - **Demo** (démonstration guidée)
   - **TP / Exercice** (travail à faire)
   - **Action de développement** implicite (création de module/controller/service, wiring DI, endpoints, validation, tests, etc.)
2. Convertir ces éléments en tâches actionnables, ordonnées dans une progression logique.
3. Chaque tâche doit indiquer clairement :
   - le **chapitre** et la **slide YAML** source (chemin relatif)
   - l’**intention** (ce qu’on apprend / ce que la tâche prouve)
   - la **livrable** (fichiers ou artefacts attendus : endpoint, module, test, etc.)

## Règles de qualité

- Être **concis**, orienté action (verbes à l’infinitif).
- Ne pas inventer de fonctionnalités hors du contenu des slides : si c’est ambigu, rester minimal.
- Regrouper par chapitre, tout en gardant une chronologie de réalisation.
- Les tâches doivent être suffisamment précises pour qu’un stagiaire puisse coder sans deviner.

## Contrainte

- Ne pas faire le chapitre `01-typescript-mini-express`. Ne faire que ce qui concerne le projet NestJS.
- Donner une id aux taches (format <idNN>, exemple: id01, id02, ..., id45, ...)

## Format de sortie (obligatoire)

Créer/mettre à jour un fichier unique : `/TODO.md`

Le fichier doit contenir :

- Un titre + une courte intro.
- Une section par chapitre (ex: `## 02-demarrage-nestjs`).
- Des checkboxes Markdown par tâche : `- [ ] ...`.
- Pour chaque tâche, inclure le lien de traçabilité vers la slide : `(specifications/.../xx-yyy.yaml)`.

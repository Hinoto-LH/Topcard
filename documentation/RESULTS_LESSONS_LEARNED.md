# Résultats et leçons apprises — Topcard

**Période :** 22 mai → 03 juillet 2026 | **Équipe :** développement solo
**Projet :** application web de suivi de collection One Piece Card Game (AdonisJS · Angular · PostgreSQL)

---

## 1. Résumé des résultats

### Fonctionnalités clés du MVP

Le MVP livré couvre l'intégralité du parcours collectionneur :

- **Authentification** — inscription, connexion par email ou nom d'utilisateur, déconnexion ; session sécurisée par cookie avec protection CSRF
- **Catalogue** — liste des extensions (sets) avec aperçu, page détail avec grille de cartes et barre de complétion, fiche détaillée de chaque carte
- **Gestion de collection** — ajout et suppression de cartes, gestion des quantités, filtres (possédées / manquantes, par extension), mises à jour optimistes côté interface
- **Cartes manquantes** — liste des cartes manquantes par extension avec pourcentage de complétion, export CSV de la collection
- **Profil et statistiques** — taux de complétion global et cartes possédées
- **Administration** — synchronisation des sets et des cartes depuis l'API externe TCG, réservée au rôle admin

### Comparaison avec les objectifs initiaux

Les objectifs initiaux du projet sont définis par les user stories priorisées en MoSCoW dans la [documentation technique](READMEfr.md) (16 stories en scope V1, 3 reportées volontairement en V2/V3).

| Priorité | Prévu | Livré | Taux |
|----------|-------|-------|------|
| Must Have | 11 | 11 | 100 % |
| Should Have | 4 | 4 | 100 % |
| Could Have | 1 | 1 | 100 % |
| **Total scope V1** | **16** | **16** | **100 %** |

Le MVP atteint donc **100 % des fonctionnalités planifiées**, y compris la story optionnelle (export CSV des cartes manquantes). Les 3 stories « Won't Have » (cote des cartes, échanges entre utilisateurs, événements boutiques) restent hors scope, conformément au plan initial.

Deux écarts par rapport au projet tel que conçu au départ, tous deux assumés :

- **Migration du frontend** — le projet a démarré en React/Inertia et a été migré vers une SPA Angular 22 en cours de route ; la migration a été réalisée sans perte fonctionnelle
- **Pas de déploiement en production** — l'application s'exécute en local via Docker ; le déploiement est identifié comme prochaine étape

### Indicateurs clés

| Indicateur | Valeur |
|------------|--------|
| Stories livrées / planifiées (scope V1) | 16 / 16 (100 %) |
| Tests automatisés backend | 48 cas (40 fonctionnels + 8 unitaires), 100 % au vert |
| Bugs recensés pendant le projet | 10 ([suivi détaillé](BUG_TRACKING.md)) |
| Bugs ouverts en fin de cycle | 0 — tous résolus |
| Pull requests mergées | 30 |
| Durée du cycle | 6 semaines |

---

## 2. Leçons apprises

### Ce qui a bien fonctionné, et pourquoi

- **Une architecture découplée dès le départ.** La séparation stricte backend API JSON / frontend SPA a rendu la migration React → Angular possible en une journée, sans toucher au backend. Investir tôt dans les frontières d'architecture a payé au moment le plus critique du projet.
- **Des tests backend écrits pendant le développement.** Les 48 cas Japa (isolés par SQLite et truncation de tables) ont servi de filet de sécurité pendant la stabilisation : plusieurs régressions (négociation de contenu, comparaison de rôles) ont été détectées par la suite de tests avant d'atteindre l'utilisateur.
- **Un historique git discipliné.** Branches `feat`/`fix` systématiques, commits conventionnels (feat / fix / chore / docs) et merges par pull request ont rendu le suivi du projet lisible — le [bug tracking](BUG_TRACKING.md) référence directement les commits de correction.
- **La priorisation MoSCoW.** Définir explicitement les « Won't Have » dès le départ a évité la dérive du périmètre : aucune fonctionnalité hors scope n'a été entamée.

### Difficultés rencontrées et résolution

| Difficulté | Résolution |
|------------|------------|
| La suite de tests exigeait une instance PostgreSQL active et renvoyait des faux négatifs (404 au lieu de 422) | Bascule sur SQLite en environnement de test et ajout de l'en-tête `Accept: application/json` dans le bootstrap de test (BUG-006, BUG-007) |
| Résidus de l'ancienne stack React/Inertia après la migration Angular (templates cassés, config TypeScript incomplète) | Réécriture des templates en syntaxe Angular native et ajout explicite de `rootDir` dans les tsconfig (BUG-004, BUG-005) |
| Comportements dépendants de l'environnement (URL d'export codée en dur, comparaison de rôle sensible à l'ordre du seed) | Généralisation via `environment.apiUrl` et comparaison des rôles par nom plutôt que par id (BUG-008, BUG-009) |
| Absence de rétrospectives en cours de projet | Bilan réalisé en fin de cycle ([rétrospective](RETROSPECTIVE.md)) ; rétrospectives systématiques planifiées à chaque fin de sprint |

### Axes d'amélioration pour les prochains projets

- **Tester le frontend au même niveau que le backend.** Le déséquilibre (48 tests backend, 0 test frontend) est le principal manque du cycle ; les tests des services Angular sont la première action du prochain sprint.
- **Ne pas laisser de code mort en base.** Le rôle `pro`, seedé mais jamais spécifié, a créé de la confusion ; toute donnée introduite doit avoir une user story associée, sinon être supprimée.
- **Ritualiser les rétrospectives.** Un point de recul à chaque fin de sprint aurait permis d'ajuster plus tôt (notamment sur les tests frontend) au lieu de tout constater en fin de cycle.
- **Prévoir le déploiement dans le scope.** Valider l'application en environnement réel (VPS ou PaaS) plutôt que seulement en local, pour détecter au plus tôt les comportements dépendants de l'environnement.

---

## 3. Points clés de la rétrospective

Une rétrospective de fin de cycle a été tenue le **03 juillet 2026** (compte rendu complet : [RETROSPECTIVE.md](RETROSPECTIVE.md)). Le projet étant mené en solo, l'exercice a pris la forme d'une auto-évaluation structurée autour des questions guides ci-dessous.

### Qu'est-ce qui a bien fonctionné dans l'organisation du travail ?

- **La discipline de processus a remplacé la coordination d'équipe** : branches `feat`/`fix` systématiques, pull requests même en solo, commits conventionnels — chaque changement est traçable et relisible
- **La livraison continue** a maintenu un rythme régulier sur les 6 semaines, sans effet tunnel : l'historique git montre une progression constante plutôt que des livraisons massives en fin de cycle
- **Les décisions d'architecture prises tôt** (backend et frontend découplés) ont donné de la flexibilité au moment où le projet en a eu le plus besoin (migration Angular)

### Quelles difficultés a-t-on rencontrées, et comment ont-elles été résolues ?

- **La migration de stack en cours de projet** (React/Inertia → Angular 22) a laissé des résidus (templates, config TypeScript) — résolus méthodiquement via le suivi de bugs (BUG-004, BUG-005) plutôt qu'en corrections improvisées
- **La suite de tests était couplée à l'infrastructure locale** (PostgreSQL requis) — résolu en isolant l'environnement de test (SQLite, en-têtes JSON explicites), ce qui a rendu les tests exécutables partout
- **L'absence de point de recul en cours de cycle** : aucune rétrospective intermédiaire n'a été tenue, les problèmes structurels (zéro test frontend, rôle `pro` mort) n'ont été formalisés qu'en fin de projet

### Comment améliorer la collaboration pour les prochains projets ?

- **Ritualiser les cérémonies agiles même en solo** : une rétrospective courte à chaque fin de sprint, planifiée dès le sprint planning, pour corriger la trajectoire pendant le projet et non après
- **Traiter le Kanban comme source de vérité** : le passage du suivi vers GitHub (issues + board) centralise le travail au même endroit que le code — à maintenir dès le premier jour du prochain projet
- **En contexte d'équipe, ces pratiques solo se transposent** : les PRs systématiques deviennent des revues croisées, le bug tracking partagé évite les doublons de diagnostic, et les définitions claires de scope (MoSCoW) réduisent les ambiguïtés d'attribution des tâches
- **Suggestion retenue** : allouer explicitement du temps de test et de stabilisation dans chaque sprint (le ratio tests backend/frontend déséquilibré vient d'un manque de planification, pas de temps)

---

*Documents liés : [Sprint Review](SPRINT_REVIEW.md) · [Rétrospective](RETROSPECTIVE.md) · [Bug Tracking](BUG_TRACKING.md) · [Liens du projet](LINKSfr.md)*

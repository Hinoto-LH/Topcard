# Bug Tracking — Topcard
**Période :** 22 mai → 03 juillet 2026

Suivi des bugs identifiés et corrigés au cours du projet.

---

## Tableau des bugs

| ID | Date | Sévérité | Description | Cause racine | Résolution | Commit |
|----|------|----------|-------------|--------------|------------|--------|
| BUG-001 | 2026-06-26 | Haute | Le formulaire d'inscription rejette les mots de passe valides | Regex trop restrictive acceptant seulement un sous-ensemble de caractères spéciaux | Remplacement par une regex générique acceptant tout caractère non alphanumérique | `6fd53fb` |
| BUG-002 | 2026-06-26 | Haute | L'inscription échoue côté backend malgré un formulaire valide | Le champ `passwordConfirmation` absent du payload envoyé par `AuthService` | Ajout du champ dans le service et le formulaire | `6fd53fb` |
| BUG-003 | 2026-06-26 | Basse | Les icônes des champs de saisie se superposent au texte | Le CSS global `.field input` définissait `px-4`, écrasant les utilitaires `pl-10`/`pr-4` | Suppression de `px-4` du style global | `6fd53fb` |
| BUG-004 | 2026-06-30 | Haute | La compilation TypeScript du frontend échoue | `rootDir` absent de `tsconfig.app.json` et `tsconfig.spec.json` | Ajout explicite de `rootDir` dans les deux fichiers | `a613f28` |
| BUG-005 | 2026-06-30 | Moyenne | Les templates des formulaires login et signup sont incorrects après la migration Angular | Résidus de syntaxe de l'ancienne version React/Inertia | Réécriture des templates en syntaxe Angular native | `682f57c` |
| BUG-006 | 2026-07-01 | Haute | La suite de tests renvoie des erreurs de contenu (404 au lieu de 422 sur les validations) | Le client de test n'envoyait pas `Accept: application/json`, déclenchant la négociation de contenu HTML | Ajout de l'en-tête `Accept: application/json` dans le bootstrap de test | `ac5cfff` |
| BUG-007 | 2026-07-01 | Haute | Les tests requièrent une instance PostgreSQL active pour s'exécuter | `config/database.ts` utilisait toujours PostgreSQL en environnement de test | Configuration de SQLite comme base de données de test via `app.inTest` | `ac5cfff` |
| BUG-008 | 2026-07-01 | Moyenne | `isAdmin()` retourne `false` pour un admin selon l'ordre du seed | La comparaison se faisait sur le `roleId` (entier), sensible à l'ordre d'insertion en base | Comparaison par nom de rôle (`'admin'`) côté frontend et backend | `ac5cfff` |
| BUG-009 | 2026-07-01 | Moyenne | L'export CSV échoue en dehors de l'environnement local | L'URL d'export était codée en dur (`localhost:3333`) dans le composant collection | Construction de l'URL depuis `environment.apiUrl` | `ac5cfff` |
| BUG-010 | 2026-07-01 | Basse | La route `/500` renvoie une 404 au lieu d'afficher la page d'erreur | `ServerErrorComponent` créé mais non enregistré dans le routeur Angular | Ajout de la route `/500` dans `app.routes.ts` | `ac5cfff` |

---

## Résumé

| Sévérité | Nombre | Tous résolus |
|----------|--------|--------------|
| Haute | 4 | Oui |
| Moyenne | 3 | Oui |
| Basse | 3 | Oui |
| **Total** | **10** | **Oui** |

Aucun bug ouvert en fin de sprint.

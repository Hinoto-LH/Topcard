# Rétrospective Sprint — Topcard
**Date :** 03 juillet 2026 | **Format :** Agile classique

---

## Ce qui a bien marché

- **Architecture propre dès le départ** — la séparation backend/frontend en deux projets indépendants a évité les couplages inutiles et simplifié les décisions
- **Migration Angular réussie** — la bascule React/Inertia → Angular 22 a été faite en une journée sans dette résiduelle, avec composants standalone et lazy-loading
- **Tests backend fiables** — 48 cas Japa couvrant auth, sets, collection, sync ; isolation par truncation de table et SQLite en test, aucun impact sur la base de dev
- **Livraison continue** — features et fixes committés régulièrement, historique git lisible et cohérent (feat / fix / chore / docs)
- **Assets optimisés** — WebP/AVIF et PWA manifest intégrés tôt, pas de dette performance à rattraper

---

## Ce qui n'a pas bien marché

- **Aucun test frontend** — un seul `app.spec.ts` vide ; les services Angular (auth, collection, sets, sync) ne sont pas couverts
- **Rôle `pro` inutilisé** — seedé en base depuis le début, jamais exploité ni dans le backend ni dans le frontend, source de confusion
- **Signup renvoie `role: null`** — comportement non documenté au moment du développement, découvert plus tard lors de la stabilisation
- **Pas de rétrospectives pendant le projet** — premier bilan uniquement en fin de cycle, les ajustements auraient pu être faits plus tôt

---

## Actions pour la suite

| Priorité | Action | Quand |
|----------|--------|-------|
| Haute | Écrire des tests unitaires pour les services Angular (auth, collection) | Semaine du 7 juillet |
| Haute | Supprimer ou implémenter le rôle `pro` — ne pas laisser de dead code en base | Semaine du 7 juillet |
| Moyenne | Documenter le comportement `role: null` au signup dans le README/CLAUDE.md | Semaine du 7 juillet |
| Basse | Mettre en place des rétrospectives à chaque fin de sprint | Prochain sprint |

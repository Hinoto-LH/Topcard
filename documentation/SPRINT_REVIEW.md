# Sprint Review — Topcard
**Date :** 03 juillet 2026 | **Période :** 22 mai → 03 juillet 2026 | **Format :** Agile classique

---

## Objectif du sprint

Développer une application web fonctionnelle de suivi de collection One Piece TCG, avec :
- un backend API JSON sécurisé (auth, gestion des sets et cartes, sync externe)
- un frontend Angular SPA ergonomique
- une suite de tests automatisés fiable

---

## Fonctionnalités livrées

### Backend (mai → début juin)
| Fonctionnalité | Statut |
|----------------|--------|
| Setup AdonisJS v7 + PostgreSQL + Docker | Livré |
| Schéma de base de données (User, Role, Card, Set, UserCard) | Livré |
| Auth par session + CSRF (login, signup, logout, /me) | Livré |
| API collection (ajout, suppression, listing, filtres) | Livré |
| API sets et cartes | Livré |
| Sync admin avec l'API externe TCG | Livré |
| Middleware auth / guest / admin | Livré |
| Tests fonctionnels et unitaires (48 cas, Japa) | Livré |

### Frontend (23 juin → 30 juin)
| Fonctionnalité | Statut |
|----------------|--------|
| Migration React/Inertia → Angular 22 SPA standalone | Livré |
| Design system + navbar + Tailwind | Livré |
| Pages auth (login, signup) | Livré |
| Page landing (hero, aperçu des sets, how-it-works) | Livré |
| Page liste des sets avec skeleton loading | Livré |
| Page détail d'un set avec grille de cartes | Livré |
| Page collection avec filtres et mises à jour optimistes | Livré |
| Page cartes manquantes avec barre de complétion | Livré |
| Modal détail carte avec contrôles collection | Livré |
| Page profil & statistiques | Livré |
| Page admin sync avec état de chargement par ligne | Livré |
| Pages d'erreur 404 et 500 stylées | Livré |
| Export CSV de la collection | Livré |
| Login par nom d'utilisateur | Livré |
| Logo optimisé WebP/AVIF + manifest PWA | Livré |

---

## Ce qui n'a pas été livré

| Fonctionnalité | Raison |
|----------------|--------|
| Tests unitaires des services Angular | Priorisé après la migration frontend ; repoussé au sprint suivant |
| Implémentation du rôle `pro` | Seedé mais jamais spécifié fonctionnellement ; non développé |
| Déploiement en production | Hors scope du sprint (application locale via Docker) |
| Rétrospectives en cours de sprint | Oubli de processus — corrigé avec cette rétrospective de fin de cycle |

---

## Démonstration des fonctionnalités clés

1. **Authentification** — inscription, connexion par email ou username, déconnexion ; session persistante via cookie
2. **Parcours sets** — liste des sets avec aperçu, détail avec grille de cartes et barre de complétion
3. **Gestion de collection** — ajout/suppression de cartes, filtres (possédées/manquantes), mises à jour optimistes
4. **Export** — téléchargement CSV de la collection complète
5. **Admin sync** — synchronisation des sets et cartes depuis l'API externe, état de chargement par ligne
6. **Profil** — statistiques personnelles (taux de complétion, cartes possédées)

---

## Points d'amélioration produit identifiés

- Ajouter des notifications visuelles (toast) en cas d'erreur réseau sur les actions collection
- Préciser le rôle `pro` : fonctionnalités premium à définir ou supprimer le rôle
- Prévoir un déploiement (VPS ou PaaS) pour valider le comportement en environnement réel

---

## Décisions pour le prochain sprint

- Écrire les tests Angular manquants (services auth, collection)
- Traiter le rôle `pro` (supprimer ou implémenter)
- Documenter le comportement `role: null` au signup
- Mettre en place des rétrospectives régulières (fin de chaque sprint)

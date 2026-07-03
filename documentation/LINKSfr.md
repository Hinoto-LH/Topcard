# TopCard — Liens du projet

> Récapitulatif des liens vers les ressources de gestion de projet, le code source et les preuves de test.

| Ressource | Lien / Statut |
|-----------|---------------|
| Sprint planning | [Kanban GitHub — issues du sprint](https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc) |
| Sprint reviews | [Kanban GitHub — issues du sprint](https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc) |
| Rétrospectives | [Kanban GitHub — issues du sprint](https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc) |
| Dépôt source | [github.com/Hinoto-LH/Topcard](https://github.com/Hinoto-LH/Topcard) |
| Suivi des bugs | [GitHub Issues](https://github.com/Hinoto-LH/Topcard/issues) — tickets ouverts tout au long du projet pour signaler et suivre les bugs identifiés |
| Preuves et résultats de tests | [Dossier `tests/`](https://github.com/Hinoto-LH/Topcard/tree/main/tests) — 48 cas de test fonctionnels et unitaires ([Japa](https://japa.dev)), exécutables avec `node ace test` — détail dans les tableaux ci-dessous |
| Environnement de production | N/A — l'application n'est pas déployée en ligne ; elle s'exécute en local via `docker compose up` (PostgreSQL + AdonisJS + Angular) |

## Détails

### Gestion des sprints (GitHub)

L'ensemble du suivi agile (planification des sprints, reviews et rétrospectives) est géré en Kanban directement sur GitHub, via les issues du dépôt :
**https://github.com/Hinoto-LH/Topcard/issues?q=is%3Aissue+updated%3A%3E%40today-1w+sort%3Aupdated-desc**

Cette vue filtre les issues mises à jour au cours de la dernière semaine (sprint en cours), triées par activité récente.

### Tests

Les tests backend se trouvent dans le dépôt : **48 cas** au total (40 fonctionnels + 8 unitaires), écrits avec [Japa](https://japa.dev).

Exécution : `node ace test` (base SQLite dédiée aux tests, aucune dépendance à PostgreSQL).

#### Tests fonctionnels — `tests/functional/auth.spec.ts` (10 cas)

| Groupe | Cas testé |
|--------|-----------|
| Inscription | `POST /signup` crée le compte, le connecte et retourne le user |
| Inscription | `POST /signup` refuse un mot de passe trop faible (422) |
| Inscription | `POST /signup` refuse un username déjà pris (422) |
| Connexion | `POST /login` avec identifiants valides retourne 200 + user |
| Connexion | `POST /login` avec mauvais mot de passe échoue et ne crée pas de session |
| Connexion | `POST /login` avec username inconnu ne crée pas de session |
| Session | `GET /me` retourne 401 si non connecté |
| Session | `GET /me` retourne l'utilisateur connecté |
| Session | `POST /logout` déconnecte et retourne `{ ok: true }` |
| Middleware guest | `POST /login` redirige si l'utilisateur est déjà connecté |

#### Tests fonctionnels — `tests/functional/collection.spec.ts` (12 cas)

| Groupe | Cas testé |
|--------|-----------|
| Middleware auth | `GET /collection` retourne 401 si non connecté |
| Middleware auth | `POST /collection` retourne 401 si non connecté |
| Index | `GET /collection` retourne 200 + userCards + sets |
| Index | `GET /collection` avec filtre par set retourne 200 |
| Ajout de carte | `POST /collection` ajoute la carte avec quantité 1 |
| Ajout de carte | `POST /collection` ne crée pas de doublon si la carte est déjà présente |
| Mise à jour de quantité | `PATCH /collection/:id` met à jour la quantité |
| Mise à jour de quantité | `PATCH /collection/:id` refuse une quantité < 1 (422) |
| Mise à jour de quantité | `PATCH /collection/:id` d'un autre utilisateur retourne 404 |
| Suppression | `DELETE /collection/:id` supprime la ligne |
| Suppression | `DELETE /collection/:id` d'un autre utilisateur retourne 404 |
| Cartes manquantes | `GET /collection/missing/:id` retourne set, missCards et completion |

#### Tests fonctionnels — `tests/functional/sets.spec.ts` (9 cas)

| Groupe | Cas testé |
|--------|-----------|
| Sets > liste | `GET /sets` retourne 200 sans être connecté |
| Sets > liste | `GET /sets` retourne les sets existants |
| Sets > détail | `GET /sets/:id` retourne 200 pour un utilisateur connecté |
| Sets > détail | `GET /sets/:id` retourne 404 si le set n'existe pas |
| Sets > détail | `GET /sets/:id` inclut ownerCardsIds et completion pour l'utilisateur |
| Sets > détail | `GET /sets/:id` renvoie ownerCardsIds vide pour un visiteur non connecté |
| Cards > détail | `GET /cards/:id` retourne la carte (owned=0) pour un visiteur |
| Cards > détail | `GET /cards/:id` reflète la possession pour un utilisateur connecté |
| Cards > détail | `GET /cards/:id` retourne 404 si la carte n'existe pas |

#### Tests fonctionnels — `tests/functional/sync.spec.ts` (9 cas)

| Groupe | Cas testé |
|--------|-----------|
| Middleware auth + admin | `GET /admin/sync` retourne 401 si non connecté |
| Middleware auth + admin | `GET /admin/sync` retourne 403 si l'utilisateur n'est pas admin |
| Middleware auth + admin | `GET /admin/sync` retourne 200 (+ sets) pour un admin |
| Rôle dans le payload | `GET /me` renvoie role="admin" pour un administrateur |
| Rôle dans le payload | `GET /me` renvoie role=null pour un utilisateur sans rôle |
| Sync des sets | `POST /admin/sync/sets` crée les sets et retourne `{ synced }` |
| Sync des sets | `POST /admin/sync/sets` retourne 500 si l'API échoue |
| Sync des cartes | `POST /admin/sync/cards/:setId` crée les cartes (id base) et retourne `{ synced }` |
| Sync des cartes | `POST /admin/sync/cards/:setId` retourne 500 si le set est inconnu |

#### Tests unitaires — `tests/unit/sync_service.spec.ts` (8 cas)

| Groupe | Cas testé |
|--------|-----------|
| SyncService > syncSets | Crée les sets depuis l'API et retourne le bon compteur |
| SyncService > syncSets | Fait un upsert — met à jour le set si l'externalId existe déjà |
| SyncService > syncSets | Lève une erreur si l'API répond en erreur |
| SyncService > syncSets | Collecte les erreurs unitaires sans interrompre la sync |
| SyncService > syncCards | Crée les cartes d'un set et retourne le bon compteur |
| SyncService > syncCards | Fait un upsert — pas de doublon si la carte existe déjà |
| SyncService > syncCards | Gère la pagination — fait autant d'appels API que nécessaire |
| SyncService > syncCards | Lève une erreur si le set est introuvable en base |

### Production

Aucun environnement de production hébergé. L'application complète se lance en local :

```bash
docker compose up   # PostgreSQL + AdonisJS (:3333) + Angular (:4200)
```

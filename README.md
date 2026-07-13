# Topcard

Application de gestion de collection de cartes One Piece TCG.

## Stack technique

- **Backend** : [AdonisJS v7](https://adonisjs.com/) (API REST, TypeScript)
- **Frontend** : [Angular](https://angular.dev/) (SPA, TypeScript) — dossier `frontend/`
- **Base de données** : PostgreSQL (production) / SQLite (développement)
- **Auth** : Sessions AdonisJS + Shield (CSRF)

## Structure du projet

```
Topcard/
├── app/
│   ├── controllers/     # Contrôleurs API (retournent du JSON)
│   ├── middleware/      # Auth, admin, guest
│   ├── models/          # Modèles Lucid ORM
│   ├── validators/      # Validation des données entrantes
│   ├── services/        # Logique métier
│   └── transformers/    # Formatage des réponses JSON
├── config/              # Configuration AdonisJS
├── database/
│   ├── migrations/      # Migrations de base de données
│   └── seeders/         # Seeders
├── frontend/            # Application Angular (SPA)
│   ├── src/app/
│   │   ├── pages/       # Composants lazy-loadés (auth, sets, collection, admin)
│   │   ├── services/    # auth.ts, sets.ts, collection.ts, sync.ts
│   │   ├── guards/      # authGuard, guestGuard, adminGuard
│   │   ├── interceptors/ # credentials.interceptor.ts (XSRF + withCredentials)
│   │   └── models/      # Interfaces TypeScript miroir des réponses API
│   └── tests/           # Tests unitaires Angular (Vitest)
│       ├── app.spec.ts
│       ├── services/    # auth, cards, sets, collection, profile, sync, card-modal
│       ├── guards/      # authGuard, guestGuard, adminGuard
│       └── pages/       # CardDetailComponent, CardModalComponent
├── start/
│   ├── routes.ts        # Définition des routes API
│   └── kernel.ts        # Middleware globaux
└── tests/               # Tests unitaires et fonctionnels
```

## Prérequis

- Node.js >= 24
- PostgreSQL (ou SQLite pour le développement)

## Installation

```bash
# Cloner le repo
git clone <url>
cd Topcard

# Installer les dépendances backend
npm install

# Installer les dépendances frontend
cd frontend && npm install && cd ..

# Lancer les migrations
node ace migration:run
```

## Développement

```bash
# Lancer le backend (port 3333)
node ace serve --hmr

# Lancer le frontend (port 4200)
cd frontend && ng serve
```

## Routes API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/signup` | guest | Créer un compte (connecte immédiatement) |
| POST | `/login` | guest | Se connecter (par `username`) |
| POST | `/logout` | auth | Se déconnecter |
| GET | `/me` | auth | Utilisateur connecté (restauration de session) |
| GET | `/profile` | auth | Profil + statistiques |
| GET | `/sets` | — | Liste des sets |
| GET | `/sets/:id` | — | Détail d'un set (+ cartes possédées si connecté) |
| GET | `/cards/:id` | — | Détail d'une carte (+ possession si connecté) |
| GET | `/collection` | auth | Ma collection (filtres `search`, `setId`, `rarity`) |
| POST | `/collection` | auth | Ajouter une carte |
| PATCH | `/collection/:id` | auth | Modifier la quantité d'une carte |
| DELETE | `/collection/:id` | auth | Supprimer une carte |
| GET | `/collection/missing/:id` | auth | Cartes manquantes d'un set |
| GET | `/collection/export` | auth | Exporter la collection en CSV |
| GET | `/admin/sync` | admin | Page de synchronisation |
| POST | `/admin/sync/sets` | admin | Synchroniser les sets |
| POST | `/admin/sync/cards/:setId` | admin | Synchroniser les cartes d'un set |

## Docker

```bash
# Lancer l'environnement complet (backend + base de données)
docker compose up -d

# Lancer les migrations dans le container
docker compose exec app node ace migration:run
```

## Tests

```bash
# Tests backend (Japa — fonctionnels + unitaires)
node ace test

# Tests frontend (Vitest)
cd frontend && npx ng test --no-watch

# Couverture frontend
cd frontend && npx ng test --no-watch --coverage
```

Couverture frontend actuelle : **92 %** (statements).

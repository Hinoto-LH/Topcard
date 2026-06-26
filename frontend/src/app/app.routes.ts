import { Routes } from '@angular/router'
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard'

// loadComponent = lazy loading : le bundle JS du composant n'est téléchargé
// que lorsque l'utilisateur navigue vers la route. Réduit le bundle initial.
export const routes: Routes = [
  // Page d'accueil publique (landing page)
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },

  // Routes guest : inaccessibles si déjà connecté (redirige vers /sets)
  { path: 'login',  loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent),   canActivate: [guestGuard] },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup').then(m => m.SignupComponent), canActivate: [guestGuard] },

  // Routes publiques : accessibles sans connexion
  { path: 'sets',     loadComponent: () => import('./pages/sets/sets-list/sets-list').then(m => m.SetsListComponent) },
  { path: 'sets/:id', loadComponent: () => import('./pages/sets/set-detail/set-detail').then(m => m.SetDetailComponent) },

  // Routes protégées : redirige vers /login si non connecté
  { path: 'collection',              loadComponent: () => import('./pages/collection/collection/collection').then(m => m.CollectionComponent), canActivate: [authGuard] },
  { path: 'collection/missing/:id',  loadComponent: () => import('./pages/collection/missing/missing').then(m => m.MissingComponent),         canActivate: [authGuard] },

  // Route admin : deux guards en série — authGuard vérifie la connexion, adminGuard vérifie le rôle
  { path: 'admin/sync', loadComponent: () => import('./pages/admin/sync/sync').then(m => m.SyncComponent), canActivate: [authGuard, adminGuard] },

  // Gestion des erreurs : toute URL inconnue → 404
  { path: '404', loadComponent: () => import('./pages/errors/not-found/not-found').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' },
]

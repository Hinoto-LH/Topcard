import { Routes } from '@angular/router'
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard'

export const routes: Routes = [
  { path: '', redirectTo: 'sets', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup').then(m => m.SignupComponent), canActivate: [guestGuard] },

  { path: 'sets', loadComponent: () => import('./pages/sets/sets-list/sets-list').then(m => m.SetsListComponent) },
  { path: 'sets/:id', loadComponent: () => import('./pages/sets/set-detail/set-detail').then(m => m.SetDetailComponent) },

  { path: 'collection', loadComponent: () => import('./pages/collection/collection/collection').then(m => m.CollectionComponent), canActivate: [authGuard] },
  { path: 'collection/missing/:id', loadComponent: () => import('./pages/collection/missing/missing').then(m => m.MissingComponent), canActivate: [authGuard] },

  { path: 'admin/sync', loadComponent: () => import('./pages/admin/sync/sync').then(m => m.SyncComponent), canActivate: [authGuard, adminGuard] },

  { path: '404', loadComponent: () => import('./pages/errors/not-found/not-found').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' },
]

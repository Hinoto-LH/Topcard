import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth'

// Bloque l'accès aux routes protégées si l'utilisateur n'est pas connecté
export const authGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.isLoggedIn()) return true
  return router.createUrlTree(['/login'])
}

// Bloque l'accès aux routes guest (login/signup) si l'utilisateur est déjà connecté
export const guestGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (!auth.isLoggedIn()) return true
  return router.createUrlTree(['/sets'])
}

// Bloque l'accès aux routes admin si l'utilisateur n'est pas admin
export const adminGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.isAdmin()) return true
  return router.createUrlTree(['/sets'])
}

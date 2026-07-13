import { TestBed } from '@angular/core/testing'
import { provideRouter, UrlTree } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { authGuard, guestGuard, adminGuard } from '../../src/app/guards/auth.guard'
import { AuthService } from '../../src/app/services/auth'

const mockUser  = { id: 1, email: 'a@a.com', username: 'u', firstName: 'F', role: null }
const mockAdmin = { ...mockUser, role: 'admin' }

function runGuard(guard: () => boolean | UrlTree) {
  return TestBed.runInInjectionContext(guard)
}

describe('Guards', () => {
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    auth = TestBed.inject(AuthService)
  })

  describe('authGuard', () => {
    it('retourne true si connecté', () => {
      auth.currentUser.set(mockUser)
      expect(runGuard(authGuard)).toBe(true)
    })

    it('redirige vers /login si non connecté', () => {
      auth.currentUser.set(null)
      const result = runGuard(authGuard)
      expect(result instanceof UrlTree).toBe(true)
      expect((result as UrlTree).toString()).toBe('/login')
    })
  })

  describe('guestGuard', () => {
    it('retourne true si non connecté', () => {
      auth.currentUser.set(null)
      expect(runGuard(guestGuard)).toBe(true)
    })

    it('redirige vers /sets si déjà connecté', () => {
      auth.currentUser.set(mockUser)
      const result = runGuard(guestGuard)
      expect(result instanceof UrlTree).toBe(true)
      expect((result as UrlTree).toString()).toBe('/sets')
    })
  })

  describe('adminGuard', () => {
    it('retourne true si admin', () => {
      auth.currentUser.set(mockAdmin)
      expect(runGuard(adminGuard)).toBe(true)
    })

    it('redirige vers /sets si non admin', () => {
      auth.currentUser.set(mockUser)
      const result = runGuard(adminGuard)
      expect(result instanceof UrlTree).toBe(true)
      expect((result as UrlTree).toString()).toBe('/sets')
    })

    it('redirige vers /sets si non connecté', () => {
      auth.currentUser.set(null)
      const result = runGuard(adminGuard)
      expect(result instanceof UrlTree).toBe(true)
      expect((result as UrlTree).toString()).toBe('/sets')
    })
  })
})

import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'
import { AuthService } from '../../src/app/services/auth'
import { environment } from '../../src/environments/environment'

@Component({ template: '', standalone: true })
class StubComponent {}

const API = environment.apiUrl
const mockUser = { id: 1, email: 'test@test.com', username: 'test', firstName: 'Test', role: null }
const mockAdmin = { ...mockUser, role: 'admin' }

describe('AuthService', () => {
  let service: AuthService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: StubComponent }, { path: 'sets', component: StubComponent }]),
      ],
    })
    service = TestBed.inject(AuthService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('login() — POST /login et met à jour currentUser', () => {
    service.login('test', 'pass').subscribe()
    const req = http.expectOne(`${API}/login`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({ username: 'test', password: 'pass' })
    req.flush({ user: mockUser })
    expect(service.currentUser()).toEqual(mockUser)
  })

  it('signup() — POST /signup et met à jour currentUser', () => {
    const data = { email: 'a@a.com', password: '123', passwordConfirmation: '123', username: 'u', firstName: 'F' }
    service.signup(data).subscribe()
    const req = http.expectOne(`${API}/signup`)
    expect(req.request.method).toBe('POST')
    req.flush({ user: mockUser })
    expect(service.currentUser()).toEqual(mockUser)
  })

  it('logout() — POST /logout, vide currentUser et redirige', () => {
    service.currentUser.set(mockUser)
    service.logout().subscribe()
    const req = http.expectOne(`${API}/logout`)
    expect(req.request.method).toBe('POST')
    req.flush({})
    expect(service.currentUser()).toBeNull()
  })

  it('fetchMe() — GET /me et met à jour currentUser', () => {
    service.fetchMe().subscribe()
    const req = http.expectOne(`${API}/me`)
    expect(req.request.method).toBe('GET')
    req.flush({ user: mockUser })
    expect(service.currentUser()).toEqual(mockUser)
  })

  it('isLoggedIn() — false si currentUser est null', () => {
    service.currentUser.set(null)
    expect(service.isLoggedIn()).toBe(false)
  })

  it('isLoggedIn() — true si currentUser est défini', () => {
    service.currentUser.set(mockUser)
    expect(service.isLoggedIn()).toBe(true)
  })

  it('isAdmin() — false si role est null', () => {
    service.currentUser.set(mockUser)
    expect(service.isAdmin()).toBe(false)
  })

  it('isAdmin() — true si role est admin', () => {
    service.currentUser.set(mockAdmin)
    expect(service.isAdmin()).toBe(true)
  })
})

import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { NavigationEnd, provideRouter, Router } from '@angular/router'
import { Component } from '@angular/core'
import { App } from '../src/app/app'
import { AuthService } from '../src/app/services/auth'

@Component({ template: '', standalone: true })
class StubComponent {}

const mockUser = { id: 1, email: 'a@a.com', username: 'u', firstName: 'F', role: null }

describe('App', () => {
  let http: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: StubComponent },
          { path: 'sets', component: StubComponent },
        ]),
      ],
    }).compileComponents()
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('toggleMenu() — inverse l\'état du menu', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app.menuOpen()).toBe(false)
    app.toggleMenu()
    expect(app.menuOpen()).toBe(true)
    app.toggleMenu()
    expect(app.menuOpen()).toBe(false)
  })

  it('closeMenu() — ferme le menu', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    app.menuOpen.set(true)
    app.closeMenu()
    expect(app.menuOpen()).toBe(false)
  })

  it('logout() — ferme le menu et appelle auth.logout()', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    const auth = TestBed.inject(AuthService)
    auth.currentUser.set(mockUser)
    app.menuOpen.set(true)
    app.logout()
    http.expectOne(r => r.url.includes('/logout')).flush({})
    expect(app.menuOpen()).toBe(false)
  })

  it('ngOnInit() — ferme le menu à chaque NavigationEnd', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    fixture.detectChanges()
    app.menuOpen.set(true)
    const router = TestBed.inject(Router)
    ;(router.events as any).next(new NavigationEnd(1, '/', '/'))
    expect(app.menuOpen()).toBe(false)
  })
})

import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { ProfileService } from '../../src/app/services/profile'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

describe('ProfileService', () => {
  let service: ProfileService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(ProfileService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => expect(service).toBeTruthy())

  it('get() — GET /profile', () => {
    service.get().subscribe()
    const req = http.expectOne(`${API}/profile`)
    expect(req.request.method).toBe('GET')
    req.flush({ user: {}, stats: {}, setProgression: [] })
  })
})

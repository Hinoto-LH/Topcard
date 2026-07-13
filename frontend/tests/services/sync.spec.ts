import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { SyncService } from '../../src/app/services/sync'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

describe('SyncService', () => {
  let service: SyncService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(SyncService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => expect(service).toBeTruthy())

  it('getSets() — GET /admin/sync', () => {
    service.getSets().subscribe()
    const req = http.expectOne(`${API}/admin/sync`)
    expect(req.request.method).toBe('GET')
    req.flush({ sets: [] })
  })

  it('syncSets() — POST /admin/sync/sets', () => {
    service.syncSets().subscribe()
    const req = http.expectOne(`${API}/admin/sync/sets`)
    expect(req.request.method).toBe('POST')
    req.flush({ synced: 5 })
  })

  it('syncCards() — POST /admin/sync/cards/:id', () => {
    service.syncCards(10).subscribe()
    const req = http.expectOne(`${API}/admin/sync/cards/10`)
    expect(req.request.method).toBe('POST')
    req.flush({ synced: 100, errors: [] })
  })
})

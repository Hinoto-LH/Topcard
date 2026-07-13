import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { SetsService } from '../../src/app/services/sets'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

describe('SetsService', () => {
  let service: SetsService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(SetsService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => expect(service).toBeTruthy())

  it('getAll() — GET /sets', () => {
    service.getAll().subscribe()
    const req = http.expectOne(`${API}/sets`)
    expect(req.request.method).toBe('GET')
    req.flush({ sets: [] })
  })

  it('getById() — GET /sets/:id', () => {
    service.getById(3).subscribe()
    const req = http.expectOne(`${API}/sets/3`)
    expect(req.request.method).toBe('GET')
    req.flush({ set: { id: 3, cards: [] }, ownerCardsIds: [], completion: 0 })
  })
})

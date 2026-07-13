import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { CollectionService } from '../../src/app/services/collection'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

describe('CollectionService', () => {
  let service: CollectionService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(CollectionService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => expect(service).toBeTruthy())

  it('getCollection() — GET /collection sans filtres', () => {
    service.getCollection().subscribe()
    const req = http.expectOne(`${API}/collection`)
    expect(req.request.method).toBe('GET')
    req.flush({ userCards: [], sets: [] })
  })

  it('getCollection() — passe les filtres en query params', () => {
    service.getCollection({ search: 'Luffy', setId: 1, rarity: 'Rare' }).subscribe()
    const req = http.expectOne(r => r.url === `${API}/collection`)
    expect(req.request.params.get('search')).toBe('Luffy')
    expect(req.request.params.get('setId')).toBe('1')
    expect(req.request.params.get('rarity')).toBe('Rare')
    req.flush({ userCards: [], sets: [] })
  })

  it('getCollection() — filtre partiel (search seulement)', () => {
    service.getCollection({ search: 'Zoro' }).subscribe()
    const req = http.expectOne(r => r.url === `${API}/collection`)
    expect(req.request.params.get('search')).toBe('Zoro')
    expect(req.request.params.has('setId')).toBe(false)
    req.flush({ userCards: [], sets: [] })
  })

  it('addCard() — POST /collection avec cardId', () => {
    service.addCard(42).subscribe()
    const req = http.expectOne(`${API}/collection`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({ cardId: 42 })
    req.flush({ ok: true })
  })

  it('updateQuantity() — PATCH /collection/:id avec quantity', () => {
    service.updateQuantity(5, 3).subscribe()
    const req = http.expectOne(`${API}/collection/5`)
    expect(req.request.method).toBe('PATCH')
    expect(req.request.body).toEqual({ quantity: 3 })
    req.flush({ ok: true })
  })

  it('removeCard() — DELETE /collection/:id', () => {
    service.removeCard(7).subscribe()
    const req = http.expectOne(`${API}/collection/7`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ ok: true })
  })

  it('getMissing() — GET /collection/missing/:id', () => {
    service.getMissing(2).subscribe()
    const req = http.expectOne(`${API}/collection/missing/2`)
    expect(req.request.method).toBe('GET')
    req.flush({ set: {}, missCards: [], completion: 50 })
  })
})

import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { CardsService } from '../../src/app/services/cards'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

describe('CardsService', () => {
  let service: CardsService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(CardsService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('should be created', () => expect(service).toBeTruthy())

  it('getById() — GET /cards/:id', () => {
    service.getById(99).subscribe()
    const req = http.expectOne(`${API}/cards/99`)
    expect(req.request.method).toBe('GET')
    req.flush({ card: { id: 99 }, owned: 0, userCardId: null })
  })
})

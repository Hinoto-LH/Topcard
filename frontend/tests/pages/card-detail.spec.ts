import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { CardDetailComponent } from '../../src/app/pages/card-detail/card-detail'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl

const mockCard = { id: 1, name: 'Luffy', number: 'OP01-001', rarity: 'Super Rare', variant: 'Normal', imageUrl: '', set: { id: 1, name: 'OP-01', code: 'OP01' } }

function setup(paramId = '1') {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => paramId } } } },
    ],
  })
  const fixture = TestBed.createComponent(CardDetailComponent)
  const http = TestBed.inject(HttpTestingController)
  return { fixture, component: fixture.componentInstance, http }
}

describe('CardDetailComponent', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify())

  it('should create', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 0, userCardId: null })
    expect(component).toBeTruthy()
  })

  it('ngOnInit — charge la carte et met à jour les signaux', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 2, userCardId: 10 })
    expect(component.card()).toEqual(mockCard)
    expect(component.owned()).toBe(2)
    expect(component.userCardId()).toBe(10)
    expect(component.loading()).toBe(false)
  })

  describe('rarityColor()', () => {
    let component: CardDetailComponent

    beforeEach(() => {
      const { fixture, http } = setup()
      fixture.detectChanges()
      http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 0, userCardId: null })
      component = fixture.componentInstance
    })

    it('Common → gris',              () => expect(component.rarityColor('Common')).toBe('#9AACC0'))
    it('Super Rare → or',            () => expect(component.rarityColor('Super Rare')).toBe('#ECD084'))
    it('rareté inconnue → fallback', () => expect(component.rarityColor('Legendaire')).toBe('#9AACC0'))
    it('Leader → rouge',             () => expect(component.rarityColor('Leader')).toBe('#E06060'))
  })

  it('add() — POST /collection puis recharge la carte', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 0, userCardId: null })

    component.add()
    http.expectOne(`${API}/collection`).flush({ ok: true })
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 1, userCardId: 10 })
    expect(component.owned()).toBe(1)
  })

  it('add() — ne fait rien si updating est true', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 0, userCardId: null })

    component['updating'].set(true)
    component.add()
    http.expectNone(`${API}/collection`)
  })

  it('increment() — PATCH /collection/:id avec qty+1', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 2, userCardId: 5 })

    component.increment()
    const req = http.expectOne(`${API}/collection/5`)
    expect(req.request.body).toEqual({ quantity: 3 })
    req.flush({ ok: true })
    expect(component.owned()).toBe(3)
  })

  it('decrement() — PATCH avec qty-1 si owned > 1', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 3, userCardId: 5 })

    component.decrement()
    const req = http.expectOne(`${API}/collection/5`)
    expect(req.request.body).toEqual({ quantity: 2 })
    req.flush({ ok: true })
    expect(component.owned()).toBe(2)
  })

  it('decrement() — DELETE /collection/:id si owned === 1', () => {
    const { fixture, component, http } = setup()
    fixture.detectChanges()
    http.expectOne(`${API}/cards/1`).flush({ card: mockCard, owned: 1, userCardId: 5 })

    component.decrement()
    const req = http.expectOne(`${API}/collection/5`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ ok: true })
    expect(component.owned()).toBe(0)
    expect(component.userCardId()).toBeNull()
  })
})

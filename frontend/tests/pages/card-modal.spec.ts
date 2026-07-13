import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'
import { CardModalComponent } from '../../src/app/pages/card-modal/card-modal'
import { CardModalService } from '../../src/app/services/card-modal'
import { environment } from '../../src/environments/environment'

const API = environment.apiUrl
const mockCard = { id: 5, name: 'Zoro', number: 'OP01-025', rarity: 'Rare', variant: 'Normal', imageUrl: '', set: { id: 1, name: 'OP-01', code: 'OP01' } }

function setup() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
  })
  const fixture = TestBed.createComponent(CardModalComponent)
  const http = TestBed.inject(HttpTestingController)
  const modalService = TestBed.inject(CardModalService)
  return { fixture, component: fixture.componentInstance, http, modalService }
}

describe('CardModalComponent', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify())

  it('should create', () => {
    const { component } = setup()
    expect(component).toBeTruthy()
  })

  it('open() — charge la carte via effect', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 2, userCardId: 10 })
    expect(component.card()).toEqual(mockCard)
    expect(component.owned()).toBe(2)
    expect(component.userCardId()).toBe(10)
  })

  it('close() — remet les signaux à zéro', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 1, userCardId: 3 })
    component.close()
    fixture.detectChanges()
    expect(component.card()).toBeNull()
    expect(component.owned()).toBe(0)
    expect(component.userCardId()).toBeNull()
  })

  it('add() — POST /collection puis recharge', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 0, userCardId: null })

    component.add()
    http.expectOne(`${API}/collection`).flush({ ok: true })
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 1, userCardId: 8 })
    expect(component.owned()).toBe(1)
  })

  it('increment() — PATCH avec qty+1', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 2, userCardId: 7 })

    component.increment()
    http.expectOne(`${API}/collection/7`).flush({ ok: true })
    expect(component.owned()).toBe(3)
  })

  it('decrement() — DELETE si owned === 1', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 1, userCardId: 7 })

    component.decrement()
    const req = http.expectOne(`${API}/collection/7`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ ok: true })
    expect(component.owned()).toBe(0)
  })

  it('decrement() — PATCH avec qty-1 si owned > 1', () => {
    const { fixture, component, http, modalService } = setup()
    fixture.detectChanges()
    modalService.open(5)
    fixture.detectChanges()
    http.expectOne(`${API}/cards/5`).flush({ card: mockCard, owned: 3, userCardId: 7 })

    component.decrement()
    http.expectOne(`${API}/collection/7`).flush({ ok: true })
    expect(component.owned()).toBe(2)
  })

  it('rarityColor() — Rare → bleu', () => {
    const { component } = setup()
    expect(component.rarityColor('Rare')).toBe('#6B8AE4')
  })
})

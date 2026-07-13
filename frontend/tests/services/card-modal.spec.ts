import { TestBed } from '@angular/core/testing'
import { CardModalService } from '../../src/app/services/card-modal'

describe('CardModalService', () => {
  let service: CardModalService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CardModalService)
  })

  it('should be created', () => expect(service).toBeTruthy())

  it('activeCardId vaut null par défaut', () => {
    expect(service.activeCardId()).toBeNull()
  })

  it('open() — définit activeCardId', () => {
    service.open(42)
    expect(service.activeCardId()).toBe(42)
  })

  it('close() — remet activeCardId à null', () => {
    service.open(42)
    service.close()
    expect(service.activeCardId()).toBeNull()
  })
})

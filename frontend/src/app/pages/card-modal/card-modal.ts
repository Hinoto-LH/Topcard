import { Component, HostListener, effect, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideX, lucidePlus, lucideMinus } from '@ng-icons/lucide'
import { CardModalService } from '../../services/card-modal'
import { CardsService, CardDetail } from '../../services/cards'
import { CollectionService } from '../../services/collection'
import { AuthService } from '../../services/auth'

@Component({
  selector: 'app-card-modal',
  imports: [RouterLink, NgIconComponent],
  providers: [provideIcons({ lucideX, lucidePlus, lucideMinus })],
  templateUrl: './card-modal.html',
})
export class CardModalComponent {
  cardModal = inject(CardModalService)
  private cardsService = inject(CardsService)
  private collectionService = inject(CollectionService)
  auth = inject(AuthService)

  card = signal<CardDetail | null>(null)
  owned = signal(0)
  userCardId = signal<number | null>(null)
  loading = signal(false)
  updating = signal(false)

  constructor() {
    // effect() réagit à chaque changement de activeCardId :
    // ouverture → charge la carte / fermeture → remet à zéro
    effect(() => {
      const id = this.cardModal.activeCardId()
      if (id !== null) {
        this.load(id)
      } else {
        this.card.set(null)
        this.owned.set(0)
        this.userCardId.set(null)
      }
    })
  }

  // Ferme le modal avec la touche Échap
  @HostListener('document:keydown.escape')
  close() { this.cardModal.close() }

  private load(id: number) {
    this.loading.set(true)
    this.cardsService.getById(id).subscribe({
      next: ({ card, owned, userCardId }) => {
        this.card.set(card)
        this.owned.set(owned)
        this.userCardId.set(userCardId)
        this.loading.set(false)
        this.updating.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  add() {
    if (this.updating()) return
    this.updating.set(true)
    this.collectionService.addCard(this.card()!.id).subscribe({
      next: () => this.load(this.card()!.id),
      error: () => this.updating.set(false),
    })
  }

  increment() {
    const id = this.userCardId()
    if (!id || this.updating()) return
    this.updating.set(true)
    const newQty = this.owned() + 1
    this.collectionService.updateQuantity(id, newQty).subscribe({
      next: () => { this.owned.set(newQty); this.updating.set(false) },
      error: () => this.updating.set(false),
    })
  }

  decrement() {
    const id = this.userCardId()
    if (!id || this.updating()) return
    this.updating.set(true)
    if (this.owned() === 1) {
      this.collectionService.removeCard(id).subscribe({
        next: () => { this.owned.set(0); this.userCardId.set(null); this.updating.set(false) },
        error: () => this.updating.set(false),
      })
    } else {
      const newQty = this.owned() - 1
      this.collectionService.updateQuantity(id, newQty).subscribe({
        next: () => { this.owned.set(newQty); this.updating.set(false) },
        error: () => this.updating.set(false),
      })
    }
  }

  rarityColor(rarity: string): string {
    const map: Record<string, string> = {
      'Common':      '#9AACC0',
      'Uncommon':    '#6DB8B8',
      'Rare':        '#6B8AE4',
      'Super Rare':  '#ECD084',
      'Secret Rare': '#E06060',
      'Leader':      '#E06060',
      'DON!!':       '#E06060',
    }
    return map[rarity] ?? '#9AACC0'
  }
}

import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideMinus } from '@ng-icons/lucide'
import { CardsService, CardDetail } from '../../services/cards'
import { CollectionService } from '../../services/collection'
import { AuthService } from '../../services/auth'

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink, NgIconComponent],
  providers: [provideIcons({ lucidePlus, lucideMinus })],
  templateUrl: './card-detail.html',
})
export class CardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private cardsService = inject(CardsService)
  private collectionService = inject(CollectionService)
  auth = inject(AuthService)

  card = signal<CardDetail | null>(null)
  owned = signal(0)
  userCardId = signal<number | null>(null)
  loading = signal(true)
  // Bloque les boutons pendant un appel en cours pour éviter les doubles actions
  updating = signal(false)

  ngOnInit() {
    this.load()
  }

  // Lit l'id dans l'URL et charge la carte + les infos de possession depuis l'API
  private load() {
  const id = Number(this.route.snapshot.paramMap.get('id'))
  this.loading.set(true)
  this.cardsService.getById(id).subscribe({
    next: ({ card, owned, userCardId }) => {
      this.card.set(card)
      this.owned.set(owned)
      this.userCardId.set(userCardId)
      this.loading.set(false)
      this.updating.set(false)  // ← reset ici
    },
    error: () => { this.loading.set(false); this.updating.set(false) },
  })
}

  // Premier ajout : on n'a pas encore de userCardId — on recharge après pour l'obtenir
  add() {
    if (this.updating()) return
    this.updating.set(true)
    this.collectionService.addCard(this.card()!.id).subscribe({
      next: () => this.load(),
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
      // Dernière copie : on supprime la ligne entière de la collection
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

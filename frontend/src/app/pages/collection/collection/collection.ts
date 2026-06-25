import { Component, inject, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideTrash2, lucideSearch, lucidePackageOpen } from '@ng-icons/lucide'
import { CollectionService } from '../../../services/collection'
import { Set, UserCard } from '../../../models/models'

@Component({
  selector: 'app-collection',
  imports: [FormsModule, RouterLink, NgIconComponent],
  providers: [provideIcons({ lucideTrash2, lucideSearch, lucidePackageOpen })],
  templateUrl: './collection.html',
})
export class CollectionComponent implements OnInit {
  private collectionService = inject(CollectionService)

  userCards = signal<UserCard[]>([])
  sets = signal<Set[]>([])
  loading = signal(true)

  // Valeurs des filtres liées aux inputs via [(ngModel)]
  search = ''
  setId = ''
  rarity = ''

  ngOnInit() {
    this.load()
  }

  // Recharge la collection avec les filtres courants
  load() {
    this.loading.set(true)
    this.collectionService.getCollection({
      search: this.search || undefined,
      setId: this.setId ? Number(this.setId) : undefined,
      rarity: this.rarity || undefined,
    }).subscribe({
      next: ({ userCards, sets }) => {
        this.userCards.set(userCards)
        this.sets.set(sets)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  skeletons = Array(8)

  // Mise à jour optimiste : modifie le signal localement, puis synchro API en arrière-plan
  updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return
    this.userCards.update(cards =>
      cards.map(uc => uc.id === id ? { ...uc, quantity } : uc)
    )
    this.collectionService.updateQuantity(id, quantity).subscribe({
      error: () => this.load(), // annule si l'API échoue
    })
  }

  // Retire la carte du signal immédiatement, puis confirme côté API
  remove(id: number) {
    this.userCards.update(cards => cards.filter(uc => uc.id !== id))
    this.collectionService.removeCard(id).subscribe({
      error: () => this.load(),
    })
  }

  rarityColor(rarity: string | undefined): string {
    const map: Record<string, string> = {
      'Common':      '#9AACC0',
      'Uncommon':    '#6DB8B8',
      'Rare':        '#6B8AE4',
      'Super Rare':  '#ECD084',
      'Secret Rare': '#E06060',
      'Leader':      '#E06060',
    }
    return map[rarity ?? ''] ?? '#9AACC0'
  }
}

import { Component, inject, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CollectionService } from '../../../services/collection'
import { Set, UserCard } from '../../../models/models'

@Component({
  selector: 'app-collection',
  imports: [FormsModule, RouterLink],
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

  // Met à jour la quantité d'une carte et recharge la liste
  updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return
    this.collectionService.updateQuantity(id, quantity).subscribe({
      next: () => this.load(),
    })
  }

  // Supprime une carte de la collection et recharge la liste
  remove(id: number) {
    this.collectionService.removeCard(id).subscribe({
      next: () => this.load(),
    })
  }
}

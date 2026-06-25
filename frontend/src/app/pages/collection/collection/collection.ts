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
  skeletons = Array(8)

  // Valeurs des filtres — simples propriétés (pas des signals) car elles sont
  // liées à des inputs via [(ngModel)] qui gère lui-même la réactivité.
  search = ''
  setId = ''
  rarity = ''

  ngOnInit() {
    this.load()
  }

  load() {
    this.loading.set(true)
    this.collectionService.getCollection({
      // On passe undefined plutôt qu'une chaîne vide pour ne pas envoyer
      // le paramètre dans l'URL quand le filtre est vide.
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

  // Mise à jour optimiste : on modifie le signal immédiatement pour un retour
  // visuel instantané, puis on confirme en arrière-plan. Si l'API échoue,
  // this.load() recharge l'état réel depuis le serveur.
  updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return
    this.userCards.update(cards =>
      cards.map(uc => uc.id === id ? { ...uc, quantity } : uc)
    )
    this.collectionService.updateQuantity(id, quantity).subscribe({
      error: () => this.load(),
    })
  }

  // Même pattern optimiste que updateQuantity.
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

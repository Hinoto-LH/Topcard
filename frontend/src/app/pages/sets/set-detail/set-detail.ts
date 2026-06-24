import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { SetsService, SetWithCards } from '../../../services/sets'
import { CollectionService } from '../../../services/collection'
import { AuthService } from '../../../services/auth'

@Component({
  selector: 'app-set-detail',
  imports: [RouterLink],
  templateUrl: './set-detail.html',
})
export class SetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private setsService = inject(SetsService)
  private collectionService = inject(CollectionService)
  auth = inject(AuthService)

  set = signal<SetWithCards | null>(null)
  ownerCardsIds = signal<number[]>([])
  completion = signal(0)
  loading = signal(true)
  addingCardId = signal<number | null>(null)

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.setsService.getById(id).subscribe({
      next: ({ set, ownerCardsIds, completion }) => {
        this.set.set(set)
        this.ownerCardsIds.set(ownerCardsIds)
        this.completion.set(completion)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  // 12 squelettes pour imiter une grille de cartes pendant le chargement
  skeletons = Array(12)

  owns(cardId: number) {
    return this.ownerCardsIds().includes(cardId)
  }

  // Couleur associée à chaque rareté One Piece TCG
  rarityColor(rarity: string): string {
    const map: Record<string, string> = {
      'Common':       '#9AACC0',
      'Uncommon':     '#6DB8B8',
      'Rare':         '#6B8AE4',
      'Super Rare':   '#ECD084',
      'Secret Rare':  '#E06060',
      'Leader':       '#E06060',
      'DON!!':        '#E06060',
    }
    return map[rarity] ?? '#9AACC0'
  }

  addCard(cardId: number) {
    this.addingCardId.set(cardId)
    this.collectionService.addCard(cardId).subscribe({
      next: () => {
        this.ownerCardsIds.update(ids => [...ids, cardId])
        this.addingCardId.set(null)
      },
      error: () => this.addingCardId.set(null),
    })
  }
}

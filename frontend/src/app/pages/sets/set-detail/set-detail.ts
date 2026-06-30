import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { SetsService, SetWithCards } from '../../../services/sets'
import { CollectionService } from '../../../services/collection'
import { AuthService } from '../../../services/auth'
import { CardModalService } from '../../../services/card-modal'

@Component({
  selector: 'app-set-detail',
  imports: [RouterLink],
  templateUrl: './set-detail.html',
})
export class SetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private setsService = inject(SetsService)
  private collectionService = inject(CollectionService)
  // auth est public car le template en a besoin pour isLoggedIn() et isAdmin()
  auth = inject(AuthService)
  cardModal = inject(CardModalService)

  set = signal<SetWithCards | null>(null)
  // Liste des cardId possédés par l'utilisateur pour ce set — évite de charger
  // les objets Card complets, on compare juste des ids.
  ownerCardsIds = signal<number[]>([])
  completion = signal(0)
  loading = signal(true)
  // Id de la carte en cours d'ajout — permet de désactiver uniquement son bouton
  // plutôt que tous les boutons du set pendant l'appel API.
  addingCardId = signal<number | null>(null)
  skeletons = Array(12)

  ngOnInit() {
    // snapshot.paramMap : lecture unique du paramètre d'URL au moment du chargement.
    // Convient ici car on ne navigue jamais entre deux set-detail sans quitter la route.
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

  owns(cardId: number) {
    return this.ownerCardsIds().includes(cardId)
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

  addCard(cardId: number) {
    this.addingCardId.set(cardId)
    this.collectionService.addCard(cardId).subscribe({
      next: () => {
        // Mise à jour optimiste : ajoute l'id localement sans recharger toute la page
        this.ownerCardsIds.update(ids => [...ids, cardId])
        this.addingCardId.set(null)
      },
      error: () => this.addingCardId.set(null),
    })
  }
}

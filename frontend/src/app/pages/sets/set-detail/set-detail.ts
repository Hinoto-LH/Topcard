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

  owns(cardId: number) {
    return this.ownerCardsIds().includes(cardId)
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

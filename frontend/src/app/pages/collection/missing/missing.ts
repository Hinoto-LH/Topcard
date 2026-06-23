import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { CollectionService } from '../../../services/collection'
import { Card, Set } from '../../../models/models'

@Component({
  selector: 'app-missing',
  imports: [RouterLink],
  templateUrl: './missing.html',
})
export class MissingComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private collectionService = inject(CollectionService)

  set = signal<Set | null>(null)
  missCards = signal<Card[]>([])
  completion = signal(0)
  loading = signal(true)

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.collectionService.getMissing(id).subscribe({
      next: ({ set, missCards, completion }) => {
        this.set.set(set)
        this.missCards.set(missCards)
        this.completion.set(completion)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}

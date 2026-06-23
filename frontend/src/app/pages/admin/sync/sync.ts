import { Component, inject, OnInit, signal } from '@angular/core'
import { SyncService } from '../../../services/sync'
import { Set } from '../../../models/models'

@Component({
  selector: 'app-sync',
  imports: [],
  templateUrl: './sync.html',
})
export class SyncComponent implements OnInit {
  private syncService = inject(SyncService)

  sets = signal<Set[]>([])
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null)
  loading = signal(false)

  ngOnInit() {
    this.syncService.getSets().subscribe({
      next: ({ sets }) => this.sets.set(sets),
    })
  }

  // Lance la sync de tous les sets et affiche le résultat
  syncSets() {
    this.loading.set(true)
    this.syncService.syncSets().subscribe({
      next: ({ synced }) => {
        this.message.set({ text: `${synced} sets synchronisés`, type: 'success' })
        this.loading.set(false)
        this.syncService.getSets().subscribe(({ sets }) => this.sets.set(sets))
      },
      error: (err) => {
        this.message.set({ text: err.error?.error ?? 'Erreur lors de la sync', type: 'error' })
        this.loading.set(false)
      },
    })
  }

  // Lance la sync des cartes d'un set spécifique
  syncCards(setId: number) {
    this.loading.set(true)
    this.syncService.syncCards(setId).subscribe({
      next: ({ synced }) => {
        this.message.set({ text: `${synced} cartes synchronisées`, type: 'success' })
        this.loading.set(false)
      },
      error: (err) => {
        this.message.set({ text: err.error?.error ?? 'Erreur lors de la sync', type: 'error' })
        this.loading.set(false)
      },
    })
  }
}

import { Component, inject, OnInit, signal } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideRefreshCw, lucideCheckCircle, lucideAlertCircle, lucideDatabase } from '@ng-icons/lucide'
import { SyncService } from '../../../services/sync'
import { Set } from '../../../models/models'

@Component({
  selector: 'app-sync',
  imports: [NgIconComponent],
  providers: [provideIcons({ lucideRefreshCw, lucideCheckCircle, lucideAlertCircle, lucideDatabase })],
  templateUrl: './sync.html',
})
export class SyncComponent implements OnInit {
  private syncService = inject(SyncService)

  sets = signal<Set[]>([])
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null)
  // true uniquement pendant la sync globale des sets
  syncingSets = signal(false)
  // ID du set dont les cartes sont en cours de sync (null si aucun)
  syncingSetId = signal<number | null>(null)

  ngOnInit() {
    this.syncService.getSets().subscribe({
      next: ({ sets }) => this.sets.set(sets),
    })
  }

  syncSets() {
    this.syncingSets.set(true)
    this.message.set(null)
    this.syncService.syncSets().subscribe({
      next: ({ synced }) => {
        this.message.set({ text: `${synced} sets synchronisés`, type: 'success' })
        this.syncingSets.set(false)
        this.syncService.getSets().subscribe(({ sets }) => this.sets.set(sets))
      },
      error: (err) => {
        this.message.set({ text: err.error?.error ?? 'Erreur lors de la sync', type: 'error' })
        this.syncingSets.set(false)
      },
    })
  }

  syncCards(setId: number) {
    this.syncingSetId.set(setId)
    this.message.set(null)
    this.syncService.syncCards(setId).subscribe({
      next: ({ synced }) => {
        this.message.set({ text: `${synced} cartes synchronisées`, type: 'success' })
        this.syncingSetId.set(null)
      },
      error: (err) => {
        this.message.set({ text: err.error?.error ?? 'Erreur lors de la sync', type: 'error' })
        this.syncingSetId.set(null)
      },
    })
  }
}

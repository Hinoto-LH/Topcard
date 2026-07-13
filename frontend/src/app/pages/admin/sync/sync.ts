import { Component, inject, OnInit, signal } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideRefreshCw, lucideCheckCircle, lucideAlertCircle, lucideDatabase } from '@ng-icons/lucide'
import { SyncService } from '../../../services/sync'
import { Set } from '../../../models/models'

@Component({
  selector: 'app-sync',
  imports: [NgIconComponent],
  // provideIcons déclare les icônes disponibles dans ce composant uniquement —
  // elles ne sont pas disponibles globalement, ce qui limite la taille du bundle.
  providers: [provideIcons({ lucideRefreshCw, lucideCheckCircle, lucideAlertCircle, lucideDatabase })],
  templateUrl: './sync.html',
})
export class SyncComponent implements OnInit {
  private syncService = inject(SyncService)

  sets = signal<Set[]>([])
  message = signal<{ text: string; type: 'success' | 'error' } | null>(null)
  syncErrors = signal<string[]>([])
  // Deux signaux séparés pour distinguer la sync globale (tous les sets)
  // de la sync unitaire (cartes d'un set). Cela permet de n'animer que
  // le bouton concerné plutôt que de tout bloquer avec un seul loading.
  syncingSets = signal(false)
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
        // Recharge la liste après sync pour afficher les nouveaux sets
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
    this.syncErrors.set([])
    this.syncService.syncCards(setId).subscribe({
      next: ({ synced, errors }) => {
        const hasErrors = errors?.length > 0
        this.message.set({
          text: hasErrors
            ? `${synced} cartes synchronisées, ${errors.length} erreur(s)`
            : `${synced} cartes synchronisées`,
          type: hasErrors ? 'error' : 'success',
        })
        this.syncErrors.set(errors ?? [])
        this.syncingSetId.set(null)
      },
      error: (err) => {
        this.message.set({ text: err.error?.error ?? 'Erreur lors de la sync', type: 'error' })
        this.syncingSetId.set(null)
      },
    })
  }
}

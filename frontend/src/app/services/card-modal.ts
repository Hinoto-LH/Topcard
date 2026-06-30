import { Injectable, signal } from '@angular/core'

// Service partagé entre tous les composants pour ouvrir/fermer le modal carte.
// Tout composant qui inject ce service peut appeler open(id) pour afficher une carte.
@Injectable({ providedIn: 'root' })
export class CardModalService {
  activeCardId = signal<number | null>(null)

  open(id: number) { this.activeCardId.set(id) }
  close()          { this.activeCardId.set(null) }
}

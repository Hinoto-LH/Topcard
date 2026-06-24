import { Injectable, signal } from '@angular/core'

// Permet aux composants de pages de contrôler la visibilité de la navbar globale.
// Utilisé par login et signup pour masquer la navbar sur leurs layouts plein écran.
@Injectable({ providedIn: 'root' })
export class LayoutService {
  showNav = signal(true)
}

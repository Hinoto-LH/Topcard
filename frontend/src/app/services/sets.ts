import { environment } from '../../environments/environment'
import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Card, Set } from '../models/models'

const API = environment.apiUrl

// Set avec ses cartes incluses (utilisé sur la page de détail)
export interface SetWithCards extends Set {
  cards: Card[]
}

@Injectable({ providedIn: 'root' })
export class SetsService {
  private http = inject(HttpClient)

  // Récupère tous les sets pour la page liste
  getAll() {
    return this.http.get<{ sets: Set[] }>(`${API}/sets`)
  }

  // Récupère un set avec ses cartes + les IDs possédés par l'utilisateur + la complétion
  getById(id: number) {
    return this.http.get<{ set: SetWithCards; ownerCardsIds: number[]; completion: number }>(
      `${API}/sets/${id}`
    )
  }
}

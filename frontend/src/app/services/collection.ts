import { environment } from '../../environments/environment'
import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Card, Set, UserCard } from '../models/models'

const API = environment.apiUrl

// Filtres optionnels pour la page collection
export interface CollectionFilters {
  search?: string
  setId?: number
  rarity?: string
}

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient)

  // Récupère la collection de l'utilisateur avec filtres optionnels passés en query params
  getCollection(filters: CollectionFilters = {}) {
    let params = new HttpParams()
    if (filters.search) params = params.set('search', filters.search)
    if (filters.setId) params = params.set('setId', String(filters.setId))
    if (filters.rarity) params = params.set('rarity', filters.rarity)

    return this.http.get<{ userCards: UserCard[]; sets: Set[]; search?: string; setId?: string; rarity?: string }>(
      `${API}/collection`,
      { params }
    )
  }

  // Ajoute une carte à la collection (quantité initiale de 1)
  addCard(cardId: number) {
    return this.http.post<{ ok: boolean }>(`${API}/collection`, { cardId })
  }

  // Met à jour la quantité d'une carte dans la collection
  updateQuantity(id: number, quantity: number) {
    return this.http.patch<{ ok: boolean }>(`${API}/collection/${id}`, { quantity })
  }

  // Supprime une carte de la collection
  removeCard(id: number) {
    return this.http.delete<{ ok: boolean }>(`${API}/collection/${id}`)
  }

  // Récupère les cartes manquantes d'un set + le pourcentage de complétion
  getMissing(setId: number) {
    return this.http.get<{ set: Set; missCards: Card[]; completion: number }>(
      `${API}/collection/missing/${setId}`
    )
  }
}

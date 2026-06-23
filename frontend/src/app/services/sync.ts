import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Set } from '../models/models'

const API = 'http://localhost:3333'

@Injectable({ providedIn: 'root' })
export class SyncService {
  private http = inject(HttpClient)

  // Récupère la liste des sets en base pour afficher la page admin
  getSets() {
    return this.http.get<{ sets: Set[] }>(`${API}/admin/sync`)
  }

  // Déclenche la synchronisation de tous les sets depuis l'API externe
  syncSets() {
    return this.http.post<{ synced: number }>(`${API}/admin/sync/sets`, {})
  }

  // Déclenche la synchronisation des cartes d'un set spécifique
  syncCards(setId: number) {
    return this.http.post<{ synced: number }>(`${API}/admin/sync/cards/${setId}`, {})
  }
}

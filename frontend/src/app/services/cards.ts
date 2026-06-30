import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Card, Set } from '../models/models'

const API = environment.apiUrl

export interface CardDetail extends Card {
  set: Set
}

@Injectable({ providedIn: 'root' })
export class CardsService {
  private http = inject(HttpClient)

  getById(id: number) {
    return this.http.get<{ card: CardDetail; owned: number; userCardId: number | null }>(`${API}/cards/${id}`)
  }
}

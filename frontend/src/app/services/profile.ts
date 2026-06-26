import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

const API = 'http://localhost:3333'

export interface ProfileStats {
  uniqueCards:         number
  totalWithDuplicates: number
  completedSets:       number
  totalSets:           number
  duplicates:          number
  legendaryCards:      number
}

export interface SetProgression {
  id:         number
  name:       string
  code:       string
  owned:      number
  total:      number
  completion: number
}

export interface ProfileData {
  user:           { firstName: string; username: string; email: string }
  stats:          ProfileStats
  setProgression: SetProgression[]
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient)

  get() {
    return this.http.get<ProfileData>(`${API}/profile`)
  }
}

import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap } from 'rxjs'
import { User } from '../models/models'

const API = 'http://localhost:3333'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  // Signal qui contient l'utilisateur connecté, ou null si non connecté
  // Les composants peuvent s'y abonner pour réagir aux changements
  currentUser = signal<User | null>(null)

  // Envoie les identifiants au backend et met à jour currentUser en cas de succès
  login(email: string, password: string) {
    return this.http.post<{ user: User }>(`${API}/login`, { email, password }).pipe(
      tap(({ user }) => this.currentUser.set(user))
    )
  }

  // Crée un compte, connecte automatiquement l'utilisateur et met à jour currentUser
  signup(data: { email: string; password: string; username: string; firstName: string }) {
    return this.http.post<{ user: User }>(`${API}/signup`, data).pipe(
      tap(({ user }) => this.currentUser.set(user))
    )
  }

  // Déconnecte côté backend, vide currentUser et redirige vers /login
  logout() {
    return this.http.post(`${API}/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null)
        this.router.navigate(['/login'])
      })
    )
  }

  // Appelé au démarrage de l'app pour restaurer la session existante
  fetchMe() {
    return this.http.get<{ user: User }>(`${API}/me`).pipe(
      tap(({ user }) => this.currentUser.set(user))
    )
  }

  isLoggedIn() {
    return this.currentUser() !== null
  }

  isAdmin() {
    return this.currentUser()?.role === 1
  }
}

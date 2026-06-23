import { Component, inject, OnInit } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { AuthService } from './services/auth'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
})
export class App implements OnInit {
  auth = inject(AuthService)

  ngOnInit() {
    // Au démarrage de l'app, tente de restaurer la session existante
    // Si le cookie de session est valide, currentUser sera peuplé
    this.auth.fetchMe().subscribe({ error: () => {} })
  }

  logout() {
    this.auth.logout().subscribe()
  }
}

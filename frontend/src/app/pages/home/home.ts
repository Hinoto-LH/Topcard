import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AuthService } from '../../services/auth'
import { SetsService } from '../../services/sets'
import { Set } from '../../models/models'

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  auth = inject(AuthService)
  private setsService = inject(SetsService)

  // On limite à 6 sets pour l'aperçu de la landing page
  sets = signal<Set[]>([])

  ngOnInit() {
    this.setsService.getAll().subscribe({
      next: ({ sets }) => this.sets.set(sets.slice(0, 6)),
    })
  }
}

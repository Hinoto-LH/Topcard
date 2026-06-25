import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SetsService } from '../../../services/sets'
import { Set } from '../../../models/models'

@Component({
  selector: 'app-sets-list',
  imports: [RouterLink],
  templateUrl: './sets-list.html',
})
export class SetsListComponent implements OnInit {
  private setsService = inject(SetsService)

  sets = signal<Set[]>([])
  loading = signal(true)
  // Tableau vide de 8 éléments : sert uniquement à boucler 8 fois dans @for
  // pour afficher 8 cartes squelettes pendant le chargement.
  skeletons = Array(8)

  ngOnInit() {
    this.setsService.getAll().subscribe({
      next: ({ sets }) => {
        this.sets.set(sets)
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }
}

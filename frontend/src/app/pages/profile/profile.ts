import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ProfileService, ProfileData } from '../../services/profile'

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService)

  data = signal<ProfileData | null>(null)
  loading = signal(true)
  error = signal<string | null>(null)
  skeletons = Array(6)

  ngOnInit() {
    this.profileService.get().subscribe({
      next: (data) => {
        this.data.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Impossible de charger le profil')
        this.loading.set(false)
      },
    })
  }
}

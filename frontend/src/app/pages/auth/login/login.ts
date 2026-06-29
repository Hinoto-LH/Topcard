import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideUser, lucideLock, lucideEye, lucideEyeOff, lucideAlertCircle } from '@ng-icons/lucide'
import { AuthService } from '../../../services/auth'
import { LayoutService } from '../../../services/layout'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIconComponent],
  // provideIcons déclare les icônes disponibles dans ce composant uniquement
  providers: [provideIcons({ lucideUser, lucideLock, lucideEye, lucideEyeOff, lucideAlertCircle })],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService)
  private router = inject(Router)
  private layout = inject(LayoutService)

  username = ''
  password = ''
  showPassword = false
  error = signal<string | null>(null)
  loading = signal(false)

  ngOnInit()    { this.layout.showNav.set(false) }
  ngOnDestroy() { this.layout.showNav.set(true) }

  submit() {
    this.error.set(null)
    this.loading.set(true)

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/sets']),
      error: () => {
        this.error.set('Pseudo ou mot de passe incorrect')
        this.loading.set(false)
      },
    })
  }
}

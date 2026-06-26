
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideMail, lucideLock, lucideEye, lucideEyeOff, lucideAlertCircle, lucideUser } from '@ng-icons/lucide'
import { AuthService } from '../../../services/auth'
import { LayoutService } from '../../../services/layout'

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, NgIconComponent],
  providers: [provideIcons({ lucideMail, lucideLock, lucideEye, lucideEyeOff, lucideAlertCircle, lucideUser })],
  templateUrl: './signup.html',
})
export class SignupComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService)
  private router = inject(Router)
  private layout = inject(LayoutService)

  // Masque la navbar à l'entrée et la restaure à la sortie —
  // la page signup utilise un layout plein écran sans navbar.
  ngOnInit()    { this.layout.showNav.set(false) }
  ngOnDestroy() { this.layout.showNav.set(true) }

  email = ''
  password = ''
  passwordConfirmation = ''
  username = ''
  firstName = ''
  showPassword = false
  showPasswordConfirmation = false
  error = signal<string | null>(null)

  // Vérifie chaque règle en temps réel pour le checklist affiché sous le champ
  get passwordRules() {
    const p = this.password
    return {
      length:  p.length >= 8,
      upper:   /[A-Z]/.test(p),
      digit:   /\d/.test(p),
      special: /[^a-zA-Z0-9]/.test(p),
    }
  }

  get passwordValid() {
    const r = this.passwordRules
    return r.length && r.upper && r.digit && r.special
  }
  loading = signal(false)

  submit() {
    this.error.set(null)
    this.loading.set(true)

    this.auth.signup({ email: this.email, password: this.password, passwordConfirmation: this.passwordConfirmation, username: this.username, firstName: this.firstName }).subscribe({
      next: () => this.router.navigate(['/sets']),
      error: (err) => {
        this.error.set(err.error?.errors?.[0]?.message ?? 'Erreur lors de l\'inscription')
        this.loading.set(false)
      },
    })
  }
}

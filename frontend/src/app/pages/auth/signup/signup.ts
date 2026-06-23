import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../services/auth'

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class SignupComponent {
  private auth = inject(AuthService)
  private router = inject(Router)

  email = ''
  password = ''
  username = ''
  firstName = ''
  error = signal<string | null>(null)
  loading = signal(false)

  submit() {
    this.error.set(null)
    this.loading.set(true)

    this.auth.signup({ email: this.email, password: this.password, username: this.username, firstName: this.firstName }).subscribe({
      next: () => this.router.navigate(['/sets']),
      error: (err) => {
        this.error.set(err.error?.errors?.[0]?.message ?? 'Erreur lors de l\'inscription')
        this.loading.set(false)
      },
    })
  }
}

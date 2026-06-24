import { Component, inject, signal } from '@angular/core'
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router'
import { filter } from 'rxjs'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { lucideMenu, lucideX, lucideLogOut, lucideSettings } from '@ng-icons/lucide'
import { AuthService } from './services/auth'
import { LayoutService } from './services/layout'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIconComponent],
  providers: [provideIcons({ lucideMenu, lucideX, lucideLogOut, lucideSettings })],
  templateUrl: './app.html',
})
export class App {
  auth = inject(AuthService)
  layout = inject(LayoutService)
  private router = inject(Router)

  // Contrôle l'ouverture du menu mobile
  menuOpen = signal(false)
  toggleMenu() { this.menuOpen.update((v) => !v) }
  closeMenu() { this.menuOpen.set(false) }

  logout() {
    this.closeMenu()
    this.auth.logout().subscribe()
  }

  ngOnInit() {
    // Ferme le menu mobile à chaque navigation
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.menuOpen.set(false)
    })
  }
}

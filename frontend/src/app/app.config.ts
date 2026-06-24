import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

import { routes } from './app.routes'
import { credentialsInterceptor } from './interceptors/credentials.interceptor'
import { AuthService } from './services/auth'

// Résout la session avant que le router traite la première URL.
// Sans ça, le guard authGuard voit l'utilisateur comme déconnecté
// et redirige vers /login avant que fetchMe() ait pu répondre.
function initAuth(auth: AuthService) {
  return () => firstValueFrom(auth.fetchMe()).catch(() => {})
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withEnabledBlockingInitialNavigation : bloque le rendu jusqu'à ce que
    // la navigation initiale soit terminée — élimine le flash navbar
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
}

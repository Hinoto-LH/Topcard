import { HttpInterceptorFn } from '@angular/common/http'

// Lit un cookie par son nom depuis document.cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfToken = getCookie('XSRF-TOKEN')

  // Ajoute withCredentials (cookies de session) + le token CSRF sur les requêtes mutantes
  // Angular ne l'envoie pas automatiquement en cross-origin, donc on le fait manuellement
  const headers: Record<string, string> = {}
  if (xsrfToken && !['GET', 'HEAD'].includes(req.method)) {
    headers['X-XSRF-TOKEN'] = xsrfToken
  }

  return next(req.clone({ withCredentials: true, setHeaders: headers }))
}

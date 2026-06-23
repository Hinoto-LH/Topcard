import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

// Vérifie que l'utilisateur connecté possède le rôle 'admin'.
// Utilisé sur les routes /admin/*.
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user!
    await user.load('role')
    
    if (user.role?.name !== 'admin') {
      return response.forbidden({ error: 'Accès refusé' })
    }

    return next()
  }
}
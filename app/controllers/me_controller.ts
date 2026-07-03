import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  // Retourne l'utilisateur connecté — appelé par Angular au démarrage pour restaurer la session
  async show({ auth, response }: HttpContext) {
    const user = auth.user!
    // On renvoie le NOM du rôle (pas l'id) : Angular teste `role === 'admin'`, comme
    // AdminMiddleware côté serveur. Cela évite de dépendre de l'ordre du seed (id 1).
    await user.load('role')
    return response.json({
      user: { id: user.id, email: user.email, role: user.role?.name ?? null },
    })
  }
}

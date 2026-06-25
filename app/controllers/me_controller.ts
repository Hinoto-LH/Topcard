import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  // Retourne l'utilisateur connecté — appelé par Angular au démarrage pour restaurer la session
  async show({ auth, response }: HttpContext) {
    const user = auth.user!
    // On retourne roleId (entier) et non la relation role (objet) —
    // Angular lit ce champ pour savoir si l'utilisateur est admin (roleId === 1).
    return response.json({ user: { id: user.id, email: user.email, role: user.roleId } })
  }
}

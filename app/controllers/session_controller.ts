import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {

  // Vérifie les identifiants (verifyCredentials lève une exception si invalides)
  // puis ouvre une session web et retourne les infos utilisateur.
  // On retourne roleId (pas la relation role) car la relation n'est pas chargée ici.
  async store({ request, auth, response }: HttpContext) {
    const { username, password } = request.all()
    const user = await User.verifyCredentials(username, password)

    await auth.use('web').login(user)
    return response.json({ user: { id: user.id, email: user.email, role: user.roleId } })
  }

  // Invalide la session côté serveur. Le cookie de session est supprimé automatiquement.
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.json({ ok: true })
  }
}

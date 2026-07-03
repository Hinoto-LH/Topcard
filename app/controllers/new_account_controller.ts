import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {

  // Crée le compte et connecte l'utilisateur immédiatement dans la même requête.
  // Le mot de passe est hashé automatiquement par le hook beforeSave du modèle User.
  // roleId non fourni → un nouvel inscrit n'est jamais admin → role: null.
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })

    await auth.use('web').login(user)
    return response.json({ user: { id: user.id, email: user.email, role: null } })
  }
}

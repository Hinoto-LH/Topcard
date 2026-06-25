import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import UserCard from '#models/user_card'

export default class CardsController {

  // Retourne une carte avec son set et la quantité possédée par l'utilisateur connecté.
  // La route est publique (pas de middleware auth) mais silent_auth_middleware (global)
  // peuple auth.user si une session valide existe — owned vaut 0 pour les visiteurs.
  async show({ auth, params, response }: HttpContext) {
    const card = await Card.query()
      .where('id', params.id)
      .preload('set')
      .firstOrFail()

    let owned = 0
    if (auth.user) {
      const userCard = await UserCard.query()
        .where('userId', auth.user.id)
        .where('cardId', card.id)
        .first()
      owned = userCard?.quantity ?? 0
    }

    return response.json({ card: card.serialize(), owned })
  }
}

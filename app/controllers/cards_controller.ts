import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import UserCard from '#models/user_card'

export default class CardsController {

  // Route publique — silent_auth peuple auth.user si session valide,
  // sinon owned=0 et userCardId=null.
  async show({ auth, params, response }: HttpContext) {
    const card = await Card.query()
      .where('id', params.id)
      .preload('set')
      .firstOrFail()

    let owned = 0
    let userCardId: number | null = null
    if (auth.user) {
      const userCard = await UserCard.query()
        .where('userId', auth.user.id)
        .where('cardId', card.id)
        .first()
      owned = userCard?.quantity ?? 0
      userCardId = userCard?.id ?? null
    }

    return response.json({ card: card.serialize(), owned, userCardId })
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import CardSet from '#models/set'

export default class SetsController {

  // Liste tous les sets sans leurs cartes — le chargement des cartes se fait
  // à la demande dans show() pour alléger cette réponse.
  async index({ response }: HttpContext) {
    const sets = await CardSet.all()
    return response.json({ sets })
  }

  // Route publique : silent_auth_middleware (global) peuple auth.user si une session
  // existe, sans bloquer les visiteurs non connectés (ownerCardsIds restera []).
  async show({ auth, params, response }: HttpContext) {
    const user = auth.user

    const set = await CardSet.query().where('id', params.id).preload('cards').firstOrFail()

    let ownerCardsIds: number[] = []
    let ownedInSet = 0

    if (user) {
      const userCards = await UserCard.query().where('userId', user.id)
      ownerCardsIds = userCards.map((uc) => uc.cardId)
      ownedInSet = userCards.filter((uc) => set.cards.some((card) => card.id === uc.cardId)).length
    }

    const completion = set.cards.length > 0 ? Math.round((ownedInSet / set.cards.length) * 100) : 0

    // On renvoie set.serialize() directement : Angular attend un JSON plat,
    // pas une enveloppe transformer.
    return response.json({
      set: set.serialize(),
      ownerCardsIds,
      completion,
    })
  }
}

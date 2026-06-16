import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import CardSet from '#models/set'
import SetTransformer from '#transformers/set_transformer'

export default class SetsController {
  // Liste tous les sets disponibles
  async index({ inertia }: HttpContext) {
    const sets = await CardSet.all()
    return inertia.render('sets/index', { sets })
  }

  // Affiche les cartes d'un set avec le status de possession de l'utilisateur
  async show({ auth, params, inertia }: HttpContext) {
    const user = auth.user!

    const set = await CardSet.query().where('id', params.id).preload('cards').firstOrFail()

    const userCards = await UserCard.query().where('userId', user.id)
    const ownerCardsIds = userCards.map((uc) => uc.cardId)
    const ownedInSet = userCards.filter((uc) =>
      set.cards.some((card) => card.id === uc.cardId)
    ).length

    const completion = set.cards.length > 0 ? Math.round((ownedInSet / set.cards.length) * 100) : 0

    return inertia.render('sets/show', {
      set: SetTransformer.transform(set) as any,
      ownerCardsIds,
      completion,
    })
  }
}

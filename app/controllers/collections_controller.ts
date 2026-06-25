import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import Set from '#models/set'
import { updateQuantityValidator } from '#validators/collection'

export default class CollectionsController {

  // Charge la collection de l'utilisateur avec filtres optionnels (search, setId, rarity).
  // Les filtres sont appliqués dans la sous-requête preload pour n'interroger que les cartes
  // correspondantes plutôt que de filtrer en mémoire après coup.
  // Promise.all exécute les deux requêtes (userCards + sets) en parallèle.
  async index({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { search, setId, rarity } = request.qs()

    const query = UserCard.query()
      .where('userId', user.id)
      .preload('card', (cardQuery) => {
        cardQuery.preload('set')

        if (search) {
          cardQuery.where((q) => {
            q.where('name', 'ilike', `%${search}%`)
             .orWhere('number', 'ilike', `%${search}%`)
          })
        }
        if (setId) cardQuery.where('setId', setId)
        if (rarity) cardQuery.where('rarity', rarity)
      })

    const [userCards, sets] = await Promise.all([query, Set.all()])
    return response.json({ userCards, sets, search, setId, rarity })
  }

  // firstOrCreate : évite les doublons si la carte est déjà dans la collection.
  // Si elle existe déjà, on ne fait rien (la quantité reste inchangée).
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const cardId = request.input('cardId')

    await UserCard.firstOrCreate(
      { userId: user.id, cardId },
      { quantity: 1 }
    )

    return response.json({ ok: true })
  }

  // On filtre sur userId en plus de l'id pour éviter qu'un utilisateur modifie
  // la collection d'un autre en forgeant un id dans l'URL.
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const userCard = await UserCard.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const { quantity } = await request.validateUsing(updateQuantityValidator)
    userCard.quantity = quantity
    await userCard.save()

    return response.json({ ok: true })
  }

  // Même sécurité que update : double filtre id + userId.
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const userCard = await UserCard.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await userCard.delete()
    return response.json({ ok: true })
  }

  // Retourne les cartes manquantes d'un set + le pourcentage de complétion.
  // set.serialize() au lieu de SetTransformer.transform() : le transformer enveloppait
  // la réponse dans { $type, transformerData } qu'Angular ne sait pas désérialiser.
  async missing({ auth, params, response }: HttpContext) {
    const user = auth.user!

    const set = await Set.query()
      .where('id', params.id)
      .preload('cards')
      .firstOrFail()

    const userCards = await UserCard.query().where('userId', user.id)
    const ownerCardsIds = userCards.map((uc) => uc.cardId)

    const ownedInSet = set.cards.filter((card) => ownerCardsIds.includes(card.id))
    const missCards  = set.cards.filter((card) => !ownerCardsIds.includes(card.id))

    const completion = set.cards.length > 0
      ? Math.round((ownedInSet.length / set.cards.length) * 100)
      : 0

    return response.json({
      set: set.serialize(),
      missCards: missCards.map((c) => c.serialize()),
      completion,
    })
  }
}

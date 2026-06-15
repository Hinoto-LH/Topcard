import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import Set from '#models/set'
import User from '#models/user'
import Card from '#models/card'

export default class CollectionsController {
    // Charge la collection de l'utilisateur connecté avec filtres optionnels
    // (recherche, set, rareté).
    async index({ auth, inertia, request }: HttpContext) {
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

            if (setId) {
            cardQuery.where('setId', setId)
            }

            if (rarity) {
            cardQuery.where('rarity', rarity)
            }
        })

        const [userCards, sets] = await Promise.all([
        query,
        Set.all(),
        ])

        return inertia.render('collection/index', { userCards, sets, search,
    setId, rarity })
    }

    // Ajoute une carte à la collection avec une quantité initiale de 1.
    async store({ auth, request, response, session }: HttpContext) {
        const user = auth.user!
        const cardId = request.input('cardId')

        await UserCard.firstOrCreate(
            { userId: user.id, cardId },
            { quantity: 1 }
        )
        session.flash('success', 'Carte ajoutée à la collection')
        return response.redirect().back()
    }

    // Met à jour la quantité d'une carte dans la collection.
    async update({ auth, params, request, response, session }: HttpContext) {
        const user = auth.user!
        const userCard = await UserCard.query()
        .where('id', params.id)
        .where('userId', user.id)
        .firstOrFail()

        userCard.quantity = Number(request.input('quantity'))
        await userCard.save()

        session.flash('success', 'Quantité mise à jour')
        return response.redirect('/collection')
    }

 // Supprime une carte de la collection de l'utilisateur.
  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.user!

    const userCard = await UserCard.query()
    .where('id', params.id)
    .where('userId', user.id)
    .firstOrFail()

    await userCard.delete()

    session.flash('success', 'Carte retirée de la collection')
    return response.redirect('/collection')
  }

  // Retourne les cartes manquantes d'un set pour l'utilisateur connecté avec le 
  // pourcentage de complétion.
  async missing({ auth, params, inertia }: HttpContext) {
    const user = auth.user!

    const set = await Set.query()
    .where('id', params.id)
    .preload('cards')
    .firstOrFail()

    const userCards = await UserCard.query().where('userId', user.id)
    const ownerCardsIds = userCards.map((uc) => uc.cardId)

    const ownedInSet = set.cards.filter((card) =>
        ownerCardsIds.includes(card.id))

    const missCards = set.cards.filter((card) => 
        !ownerCardsIds.includes(card.id))

    const completion = set.cards.length > 0
    ? Math.round((ownedInSet.length / set.cards.length) * 100)
    : 0

    return inertia.render('collection/missing', {
        set: set.serialize() as any,
        missCards: missCards.map((c) => c.serialize()),
        completion })
  }
}
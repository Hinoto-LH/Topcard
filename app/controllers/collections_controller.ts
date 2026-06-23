import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import Set from '#models/set'
import SetTransformer from '#transformers/set_transformer'
import { updateQuantityValidator } from '#validators/collection'

export default class CollectionsController {
    // Charge la collection de l'utilisateur connecté avec filtres optionnels
    // (recherche, set, rareté).
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

            if (setId) {
            cardQuery.where('setId', setId)
            }

            if (rarity) {
            cardQuery.where('rarity', rarity)
            }
        })

        const [userCards, sets] = await Promise.all([query, Set.all()])

        return response.json({ userCards, sets, search, setId, rarity })
    }

    // Ajoute une carte à la collection avec une quantité initiale de 1.
    async store({ auth, request, response }: HttpContext) {
        const user = auth.user!
        const cardId = request.input('cardId')

        await UserCard.firstOrCreate(
            { userId: user.id, cardId },
            { quantity: 1 }
        )

        return response.json({ ok: true })
    }

    // Met à jour la quantité d'une carte dans la collection.
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

    // Supprime une carte de la collection de l'utilisateur.
    async destroy({ auth, params, response }: HttpContext) {
        const user = auth.user!

        const userCard = await UserCard.query()
        .where('id', params.id)
        .where('userId', user.id)
        .firstOrFail()

        await userCard.delete()

        return response.json({ ok: true })
    }

    // Retourne les cartes manquantes d'un set pour l'utilisateur connecté avec le
    // pourcentage de complétion.
    async missing({ auth, params, response }: HttpContext) {
        const user = auth.user!

        const set = await Set.query()
        .where('id', params.id)
        .preload('cards')
        .firstOrFail()

        const userCards = await UserCard.query().where('userId', user.id)
        const ownerCardsIds = userCards.map((uc) => uc.cardId)

        const ownedInSet = set.cards.filter((card) => ownerCardsIds.includes(card.id))
        const missCards = set.cards.filter((card) => !ownerCardsIds.includes(card.id))

        const completion = set.cards.length > 0
        ? Math.round((ownedInSet.length / set.cards.length) * 100)
        : 0

        return response.json({
            set: SetTransformer.transform(set),
            missCards: missCards.map((c) => c.serialize()),
            completion,
        })
    }
}

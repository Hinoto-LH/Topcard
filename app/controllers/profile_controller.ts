import type { HttpContext } from '@adonisjs/core/http'
import UserCard from '#models/user_card'
import CardSet from '#models/set'

// Raretés considérées comme "légendaires" dans One Piece TCG
const LEGENDARY_RARITIES = ['Leader', 'Secret Rare']

export default class ProfileController {

  async show({ auth, response }: HttpContext) {
    const user = auth.user!

    // Charge toutes les UserCards avec la carte associée (pour accéder à la rareté)
    const userCards = await UserCard.query()
      .where('userId', user.id)
      .preload('card')

    // Charge tous les sets avec leurs cartes pour calculer la progression par set
    const sets = await CardSet.query().preload('cards')

    // Ensemble des cardId possédés — Set<number> pour des lookups O(1)
    const ownedIds = new Set(userCards.map((uc) => uc.cardId))

    const uniqueCards          = userCards.length
    const totalWithDuplicates  = userCards.reduce((sum, uc) => sum + uc.quantity, 0)
    // Doublons = copies en excès (quantité - 1 pour chaque carte possédée en plusieurs exemplaires)
    const duplicates           = userCards.reduce((sum, uc) => sum + Math.max(0, uc.quantity - 1), 0)
    const legendaryCards       = userCards.filter((uc) => LEGENDARY_RARITIES.includes(uc.card?.rarity ?? '')).length

    // Progression par set : on exclut les sets sans cartes synchronisées
    const setProgression = sets
      .filter((set) => set.cards.length > 0)
      .map((set) => {
        const owned      = set.cards.filter((c) => ownedIds.has(c.id)).length
        const total      = set.cards.length
        const completion = Math.round((owned / total) * 100)
        return { id: set.id, name: set.name, code: set.code, owned, total, completion }
      })
      // Trie par complétion décroissante pour afficher les sets les plus avancés en premier
      .sort((a, b) => b.completion - a.completion)

    const completedSets = setProgression.filter((s) => s.completion === 100).length

    return response.json({
      user: {
        firstName: user.firstName,
        username:  user.username,
        email:     user.email,
      },
      stats: {
        uniqueCards,
        totalWithDuplicates,
        completedSets,
        totalSets: setProgression.length,
        duplicates,
        legendaryCards,
      },
      setProgression,
    })
  }
}

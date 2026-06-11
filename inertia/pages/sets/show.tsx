import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'

type Card = {
  id: number
  name: string
  number: string
  rarity: string
  imageUrl: string
  variant: string
}
type Set = { id: number; name: string; totalCards: number | null; cards: Card[] }

type Props = {
  set: Set
  ownerCardsIds: number[]
  completion: number
}

export default function SetsShow({ set, ownerCardsIds, completion }: Props) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const router = useRouter()

  return (
    <div>
      <h1>{set.name}</h1>
      <p>
        Complétion : {completion}% ({ownerCardsIds.length} /{set.totalCards ?? set.cards.length}{' '}
        cartes)
      </p>

      {flash.success && <p style={{ color: 'green' }}>{flash.success}</p>}
      {flash.error && <p style={{ color: 'red' }}>{flash.error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {set.cards.map((card) => {
          const owned = ownerCardsIds.includes(card.id)
          return (
            <div key={card.id} style={{ opacity: owned ? 1 : 0.4, width: 120 }}>
              <img src={card.imageUrl} alt={card.name} width={120} />
              <p>{card.name}</p>
              <p>
                {card.number} — {card.rarity}
              </p>
              {card.variant !== 'Normal' && <p>{card.variant}</p>}

              {owned ? (
                <p style={{ color: 'green' }}>✓ Possédée</p>
              ) : (
                <button
                  onClick={() =>
                    router.visit(
                      { href: '/collection' },
                      { method: 'post', data: { cardId: card.id } }
                    )
                  }
                >
                  Ajouter
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

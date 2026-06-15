import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'

type Card = {
    id: number; name: string; number: string; rarity:
        string; imageUrl: string; variant: string
}
type Set = { id: number; name: string; totalCards: number | null }

type Props = {
    set: Set
    missCards: Card[]
    completion: number
}

export default function MissingCards({ set, missCards, completion
}: Props) {
    const { flash } = usePage<{
        flash: {
            success?: string; error?:
                string
        }
    }>().props
    const router = useRouter()

    return (
        <div>
            <h1>Cartes manquantes — {set.name}</h1>
            <p>Complétion : {completion}% — {missCards.length} carte(s)
                manquante(s)</p>

            {flash.success && <p style={{
                color: 'green'
            }}>{flash.success}</p>}
            {flash.error && <p style={{
                color: 'red'
            }}>{flash.error}</p>}

            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '12px'
            }}>
                {missCards.map((card) => (
                    <div key={card.id} style={{ width: 120, opacity: 0.5 }}>
                        <img src={card.imageUrl} alt={card.name} width={120}
                        />
                        <p>{card.name}</p>
                        <p>{card.number} — {card.rarity}</p>
                        {card.variant !== 'Normal' && <p>{card.variant}</p>}
                        <button onClick={() => router.visit(
                            { href: '/collection' },
                            { method: 'post', data: { cardId: card.id } }
                        )}>
                            Ajouter
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'

type Set = {
id: number
externalId: string
name: string
totalCards: number | null
}

type Props = {
sets: Set[]
}

export default function AdminSync({ sets }: Props) {
    const { flash } = usePage<{ flash: { success?: string;
    error?: string } }>().props
    const router = useRouter()

    return (
        <div>
        <h1>Synchronisation</h1>

        {flash.success && <p style={{ color: 'green' 
    }}>{flash.success}</p>}
        {flash.error && <p style={{ color: 'red' 
    }}>{flash.error}</p>}

        <button onClick={() => router.visit({ route:
    'syncs.sync_sets' })}>
            Synchroniser les sets
        </button>

        <ul>
            {sets.map((set) => (
            <li key={set.id}>
                {set.name} ({set.totalCards} cartes)
                <button onClick={() => router.visit({ route:
    'syncs.sync_cards', routeParams: { setId: set.externalId }
    })}>
                Sync cartes
                </button>
            </li>
            ))}
        </ul>
        </div>
    )
}
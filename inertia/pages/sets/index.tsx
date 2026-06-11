import { useRouter } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'

type Set = { id: number; name: string; totalCards: number | null }
type Props = { sets: Set[] }

export default function SetsIndex({ sets }: Props) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const router = useRouter()

  return (
    <div>
      <h1>Sets One Piece</h1>

      {flash.success && <p style={{ color: 'green' }}>{flash.success}</p>}
      {flash.error && <p style={{ color: 'red' }}>{flash.error}</p>}

      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            <button onClick={() => router.visit({ href: `/sets/${set.id}` })}>
              {set.name} ({set.totalCards ?? '?'} cartes)
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

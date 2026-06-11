import { usePage } from '@inertiajs/react'
import { useRouter } from '@adonisjs/inertia/react'

type Set = { id: number; name: string }
type Card = { id: number; name: string; number: string; rarity: string; imageUrl: string; set: Set }
type UserCard = { id: number; quantity: number; card: Card }

type Props = {
  userCards: UserCard[]
  sets: Set[]
  search?: string
  setId?: string
  rarity?: string
}

export default function Collection({ userCards, sets, search, setId, rarity }: Props) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const router = useRouter()

  return (
    <div>
      <h1>Ma collection ({userCards.length} cartes)</h1>

      {flash.success && <p style={{ color: 'green' }}>{flash.success}</p>}
      {flash.error && <p style={{ color: 'red' }}>{flash.error}</p>}

      {/* Filtres */}
      <form onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        router.visit({
          href: `/collection?search=${data.get('search') ?? ''}&setId=${data.get('setId') ?? ''}&rarity=${data.get('rarity') ?? ''}`
        })
      }}>
        <input name="search" defaultValue={search} placeholder="Rechercher par nom ou numéro" />
        <select name="setId" defaultValue={setId}>
          <option value="">Tous les sets</option>
          {sets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select name="rarity" defaultValue={rarity}>
          <option value="">Toutes les raretés</option>
          {['Common', 'Uncommon', 'Rare', 'Super Rare', 'Secret Rare', 'Leader'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button type="submit">Filtrer</button>
      </form>

      {/* Collection */}
      <div>
        {userCards.map((uc) => (
          <div key={uc.id}>
            <img src={uc.card.imageUrl} alt={uc.card.name} width={80} />
            <p>{uc.card.name}</p>
            <p>{uc.card.number} — {uc.card.rarity}</p>
            <p>{uc.card.set.name}</p>

            <form onSubmit={(e) => {
              e.preventDefault()
              const qty = (e.currentTarget.elements.namedItem('quantity') as HTMLInputElement).value
              router.visit({ href: `/collection/${uc.id}` }, { method: 'patch', data: { quantity: qty } })
            }}>
              <input name="quantity" type="number" min={1} defaultValue={uc.quantity} />
              <button type="submit">Mettre à jour</button>
            </form>

            <button onClick={() => router.visit({ href: `/collection/${uc.id}` }, { method: 'delete' })}>
              Retirer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

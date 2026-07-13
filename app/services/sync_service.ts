import env from '#start/env'
import Set from '#models/set'
import Card from '#models/card'

interface ApiSet {
  id: string
  slug: string
  name: string
  count: number
}

interface ApiCard {
  id: string
  name: string
  number: string
  rarity: string
  variant: string
  image_url: string
  set: { slug: string }
}

export class SyncService {
  private baseUrl = 'https://api.tcgpricelookup.com/v1'
  private apiKey = env.get('TCG_API_KEY').release()

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Envoie une requête GET authentifiée. Sur 429, attend le délai indiqué par
  // l'API (header Retry-After) ou 5 s par défaut, puis retente une seule fois.
  private async callApi<T>(url: string): Promise<T> {
    const response = await globalThis.fetch(url, {
      headers: { 'X-API-Key': this.apiKey },
    })

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After') ?? 5)
      await this.sleep(retryAfter * 1000)
      return this.callApi<T>(url)
    }

    if (!response.ok) {
      throw new Error(`Erreur API ${response.status}: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  // Récupère tous les sets One Piece depuis l'API et les upsert en base.
  async syncSets(): Promise<{ synced: number; errors: string[] }> {
    const { data } = await this.callApi<{ data: ApiSet[] }>(
      `${this.baseUrl}/sets?game=onepiece`
    )

    let synced = 0
    const errors: string[] = []

    for(const apiSet of data) {
      try {
        await  Set.updateOrCreate(
          { externalId: apiSet.id },
          { name: apiSet.name, code: apiSet.slug, totalCards: apiSet.count }
        )
        synced++
      } catch (error) {
        errors.push(`${apiSet.name}: ${(error as Error).message}`)
      }
    }

    return { synced, errors }
  }
  
  // Récupère toutes les cartes d'un set depuis l'API (avec pagination)
  // et les upsert en base.
  async syncCards(setId: string | number): Promise<{ synced: number; errors: string[] }> {
    const set = await Set.findOrFail(setId)

    let offset = 0
    const limit = 100
    let total = Infinity
    let synced = 0
    const errors: string[] = []

    while (offset < total) {
      const response = await this.callApi<{ data: ApiCard[]; total: number }>(
        `${this.baseUrl}/cards/search?game=onepiece&set=${set.code}&limit=${limit}&offset=${offset}`
      )

      total = response.total

      for (const apiCard of response.data) {
        try {
          await Card.updateOrCreate(
            { externalId: apiCard.id },
            {
              setId: set.id,
              name: apiCard.name,
              number: apiCard.number,
              rarity: apiCard.rarity,
              variant: apiCard.variant,
              imageUrl: apiCard.image_url,
            }
          )
          synced++
        } catch (error) {
          errors.push(`${apiCard.name}: ${(error as Error).message}`)
        }
      }

      offset += response.data.length

      // Pause entre les pages pour ne pas saturer le rate limit de l'API.
      if (offset < total) await this.sleep(300)
    }
    return { synced, errors}
  }
}
import { test } from '@japa/runner'
import { SyncService } from '#services/sync_service'
import testUtils from '@adonisjs/core/services/test_utils'
import Set from '#models/set'
import Card from '#models/card'

const makeFetch =
  (data: unknown, ok = true) =>
  async () =>
    ({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Internal Server Error',
      json: async () => data,
    }) as unknown as Response

test.group('SyncService > syncSets', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => testUtils.db().withGlobalTransaction() as Promise<any>)
  group.each.setup(() => { savedFetch = globalThis.fetch })
  group.each.teardown(() => { globalThis.fetch = savedFetch })

  test('crée les sets depuis l\'API et retourne le bon compteur', async ({ assert }) => {
    globalThis.fetch = makeFetch({
      data: [
        { id: 'OP01', slug: 'OP-01', name: 'Romance Dawn', count: 102 },
        { id: 'OP02', slug: 'OP-02', name: 'Paramount War', count: 121 },
      ],
    })

    const result = await new SyncService().syncSets()

    assert.equal(result.synced, 2)
    assert.isEmpty(result.errors)
    const [row] = await Set.query().count('* as total')
    assert.equal(Number(row.$extras.total), 2)
  })

  test('fait un upsert — met à jour le set si l\'externalId existe déjà', async ({ assert }) => {
    await Set.create({ externalId: 'OP01', name: 'Ancien nom', code: 'OP-01', totalCards: 100 })

    globalThis.fetch = makeFetch({
      data: [{ id: 'OP01', slug: 'OP-01', name: 'Romance Dawn', count: 102 }],
    })

    const result = await new SyncService().syncSets()

    assert.equal(result.synced, 1)
    const sets = await Set.all()
    assert.lengthOf(sets, 1)
    assert.equal(sets[0].name, 'Romance Dawn')
  })

  test('lève une erreur si l\'API répond en erreur', async ({ assert }) => {
    globalThis.fetch = makeFetch({}, false)

    await assert.rejects(() => new SyncService().syncSets(), /Erreur API 500/)
  })

  test('collecte les erreurs unitaires sans interrompre la sync', async ({ assert }) => {
    const originalUpdateOrCreate = Set.updateOrCreate.bind(Set)
    let calls = 0
    ;(Set as any).updateOrCreate = async (search: any, data: any) => {
      calls++
      if (calls === 2) throw new Error('erreur simulée')
      return originalUpdateOrCreate(search, data)
    }

    globalThis.fetch = makeFetch({
      data: [
        { id: 'OP01', slug: 'OP-01', name: 'Romance Dawn', count: 102 },
        { id: 'OP02', slug: 'OP-02', name: 'Paramount War', count: 121 },
      ],
    })

    const result = await new SyncService().syncSets()
    ;(Set as any).updateOrCreate = originalUpdateOrCreate

    assert.equal(result.synced, 1)
    assert.lengthOf(result.errors, 1)
    assert.include(result.errors[0], 'Paramount War')
  })
})

test.group('SyncService > syncCards', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => testUtils.db().withGlobalTransaction() as Promise<any>)
  group.each.setup(() => { savedFetch = globalThis.fetch })
  group.each.teardown(() => { globalThis.fetch = savedFetch })

  const makeCard = (id: string, num: string) => ({
    id,
    name: `Carte ${num}`,
    number: num,
    rarity: 'C',
    variant: null,
    image_url: `https://img/${id}.png`,
    set: { slug: 'OP-01' },
  })

  test('crée les cartes d\'un set et retourne le bon compteur', async ({ assert }) => {
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 2,
    })

    globalThis.fetch = makeFetch({
      total: 2,
      data: [makeCard('c1', 'OP01-001'), makeCard('c2', 'OP01-002')],
    })

    // syncCards attend l'ID base du set (Set.findOrFail(setId)), pas l'externalId.
    const result = await new SyncService().syncCards(set.id)

    assert.equal(result.synced, 2)
    assert.isEmpty(result.errors)
    const [row] = await Card.query().count('* as total')
    assert.equal(Number(row.$extras.total), 2)
  })

  test('fait un upsert — pas de doublon si la carte existe déjà', async ({ assert }) => {
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })

    globalThis.fetch = makeFetch({ total: 1, data: [makeCard('c1', 'OP01-001')] })

    await new SyncService().syncCards(set.id)
    const result = await new SyncService().syncCards(set.id)

    assert.equal(result.synced, 1)
    const [row] = await Card.query().count('* as total')
    assert.equal(Number(row.$extras.total), 1)
  })

  test('gère la pagination — fait autant d\'appels API que nécessaire', async ({ assert }) => {
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 3,
    })

    let fetchCalls = 0
    globalThis.fetch = async () => {
      fetchCalls++
      return {
        ok: true,
        json: async () =>
          fetchCalls === 1
            ? { total: 3, data: [makeCard('c1', 'OP01-001'), makeCard('c2', 'OP01-002')] }
            : { total: 3, data: [makeCard('c3', 'OP01-003')] },
      } as unknown as Response
    }

    const result = await new SyncService().syncCards(set.id)

    assert.equal(result.synced, 3)
    assert.equal(fetchCalls, 2)
  })

  test('lève une erreur si le set est introuvable en base', async ({ assert }) => {
    await assert.rejects(() => new SyncService().syncCards('INCONNU'))
  })
})

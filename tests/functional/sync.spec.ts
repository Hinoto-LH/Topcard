import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Role from '#models/role'
import Set from '#models/set'

async function cleanData() {
  await db.rawQuery('DELETE FROM users_cards')
  await db.rawQuery('DELETE FROM cards')
  await db.rawQuery('DELETE FROM sets')
  await db.rawQuery('DELETE FROM users')
}

async function createUser() {
  return User.create({
    email: 'user@example.com',
    password: 'Password123!',
    username: 'testuser',
    firstName: 'Test',
  })
}

async function createAdmin() {
  const role = await Role.findByOrFail('name', 'admin')
  return User.create({
    email: 'admin@example.com',
    password: 'Password123!',
    username: 'adminuser',
    firstName: 'Admin',
    roleId: role.id,
  })
}

// Fabrique une fausse réponse fetch pour mocker l'API TCG externe.
const makeFetch =
  (data: unknown, ok = true) =>
  async () =>
    ({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Internal Server Error',
      json: async () => data,
    }) as unknown as Response

test.group('Sync > middleware auth + admin', (group) => {
  group.each.setup(() => cleanData())

  test('GET /admin/sync retourne 401 si non connecté', async ({ client }) => {
    const response = await client.get('/admin/sync')
    response.assertStatus(401)
  })

  test('GET /admin/sync retourne 403 si l\'utilisateur n\'est pas admin', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/admin/sync').loginAs(user)
    response.assertStatus(403)
  })

  test('GET /admin/sync retourne 200 (+ sets) pour un admin', async ({ client, assert }) => {
    const admin = await createAdmin()
    const response = await client.get('/admin/sync').loginAs(admin)
    response.assertStatus(200)
    assert.isArray(response.body().sets)
  })
})

test.group('Sync > rôle dans le payload utilisateur', (group) => {
  group.each.setup(() => cleanData())

  // Verrouille le fix isAdmin : le backend renvoie le NOM du rôle, pas un id codé en dur.
  test('GET /me renvoie role="admin" pour un administrateur', async ({ client, assert }) => {
    const admin = await createAdmin()
    const response = await client.get('/me').loginAs(admin)

    response.assertStatus(200)
    assert.equal(response.body().user.role, 'admin')
  })

  test('GET /me renvoie role=null pour un utilisateur sans rôle', async ({ client, assert }) => {
    const user = await createUser()
    const response = await client.get('/me').loginAs(user)

    response.assertStatus(200)
    assert.isNull(response.body().user.role)
  })
})

test.group('Sync > synchronisation des sets', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => cleanData())
  group.each.setup(() => {
    savedFetch = globalThis.fetch
  })
  group.each.teardown(() => {
    globalThis.fetch = savedFetch
  })

  test('POST /admin/sync/sets crée les sets et retourne { synced }', async ({ client, assert }) => {
    const admin = await createAdmin()

    globalThis.fetch = makeFetch({
      data: [{ id: 'OP01', slug: 'OP-01', name: 'Romance Dawn', count: 102 }],
    })

    const response = await client.post('/admin/sync/sets').loginAs(admin)

    response.assertStatus(200)
    assert.equal(response.body().synced, 1)

    const [row] = await Set.query().count('* as total')
    assert.equal(Number(row.$extras.total), 1)
  })

  test('POST /admin/sync/sets retourne 500 si l\'API échoue', async ({ client, assert }) => {
    const admin = await createAdmin()
    globalThis.fetch = makeFetch({}, false)

    const response = await client.post('/admin/sync/sets').loginAs(admin)

    response.assertStatus(500)
    // Aucun set ne doit avoir été créé.
    const [row] = await Set.query().count('* as total')
    assert.equal(Number(row.$extras.total), 0)
  })
})

test.group('Sync > synchronisation des cartes', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => cleanData())
  group.each.setup(() => {
    savedFetch = globalThis.fetch
  })
  group.each.teardown(() => {
    globalThis.fetch = savedFetch
  })
  // Nettoyage après le dernier test du groupe (setup ne couvre pas le dernier test)
  // Évite que les sets créés ici polluent les tests unitaires qui tournent ensuite.
  group.teardown(() => cleanData())

  test('POST /admin/sync/cards/:setId crée les cartes (id base) et retourne { synced }', async ({
    client,
    assert,
  }) => {
    const admin = await createAdmin()
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })

    globalThis.fetch = makeFetch({
      total: 1,
      data: [
        {
          id: 'c1',
          name: 'Monkey D. Luffy',
          number: 'OP01-001',
          rarity: 'Leader',
          variant: null,
          image_url: 'https://img/c1.png',
          set: { slug: 'OP-01' },
        },
      ],
    })

    // syncCards attend l'ID base du set (Set.findOrFail(setId)), pas l'externalId.
    const response = await client.post(`/admin/sync/cards/${set.id}`).loginAs(admin)

    response.assertStatus(200)
    assert.equal(response.body().synced, 1)
  })

  test('POST /admin/sync/cards/:setId retourne 500 si le set est inconnu', async ({ client }) => {
    const admin = await createAdmin()

    const response = await client.post('/admin/sync/cards/99999').loginAs(admin)
    response.assertStatus(500)
  })

  test('POST /admin/sync/cards/:setId retourne errors dans la réponse', async ({ client, assert }) => {
    const admin = await createAdmin()
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })

    globalThis.fetch = makeFetch({
      total: 1,
      data: [
        {
          id: 'c1',
          name: 'Luffy',
          number: 'OP01-001',
          rarity: 'Leader',
          variant: null,
          image_url: 'https://img/c1.png',
          set: { slug: 'OP-01' },
        },
      ],
    })

    const response = await client.post(`/admin/sync/cards/${set.id}`).loginAs(admin)

    response.assertStatus(200)
    // Le champ errors doit toujours être présent (tableau vide si tout va bien)
    assert.isArray(response.body().errors)
  })

  test('POST /admin/sync/cards/:setId accepte une carte avec number null', async ({ client, assert }) => {
    const admin = await createAdmin()
    const set = await Set.create({
      externalId: 'COL01',
      name: 'Collection Sets',
      code: 'COL-01',
      totalCards: 1,
    })

    globalThis.fetch = makeFetch({
      total: 1,
      data: [
        {
          id: 'box1',
          name: 'Devil Fruits Collection Vol. 1',
          number: null,
          rarity: 'None',
          variant: 'Normal',
          image_url: 'https://img/box1.png',
          set: { slug: 'COL-01' },
        },
      ],
    })

    const response = await client.post(`/admin/sync/cards/${set.id}`).loginAs(admin)

    response.assertStatus(200)
    assert.equal(response.body().synced, 1)
    assert.isEmpty(response.body().errors)
  })
})

import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Role from '#models/role'
import Set from '#models/set'

async function cleanData() {
  await db.rawQuery('TRUNCATE users_cards, cards, sets, users RESTART IDENTITY CASCADE')
}

async function createUser() {
  return User.create({
    email: 'user@example.com',
    password: 'password123',
    username: 'testuser',
    firstName: 'Test',
  })
}

async function createAdmin() {
  const role = await Role.findByOrFail('name', 'admin')
  return User.create({
    email: 'admin@example.com',
    password: 'password123',
    username: 'adminuser',
    firstName: 'Admin',
    roleId: role.id,
  })
}

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

  test('GET /admin/sync redirige vers /login si non connecté', async ({ client }) => {
    const response = await client.get('/admin/sync')
    response.assertRedirectsTo('/login')
  })

  test('GET /admin/sync retourne 403 si l\'utilisateur n\'est pas admin', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/admin/sync').loginAs(user)
    response.assertStatus(403)
  })

  test('GET /admin/sync retourne 200 pour un admin', async ({ client }) => {
    const admin = await createAdmin()
    const response = await client.get('/admin/sync').loginAs(admin)
    response.assertStatus(200)
  })
})

test.group('Sync > synchronisation des sets', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => cleanData())
  group.each.setup(() => { savedFetch = globalThis.fetch })
  group.each.teardown(() => { globalThis.fetch = savedFetch })

  test('POST /admin/sync/sets crée les sets et redirige', async ({ client, assert }) => {
    const admin = await createAdmin()

    globalThis.fetch = makeFetch({
      data: [{ id: 'OP01', slug: 'OP-01', name: 'Romance Dawn', count: 102 }],
    })

    const response = await client.post('/admin/sync/sets').loginAs(admin)
    response.assertRedirectsTo('/admin/sync')

    const [row] = await Set.query().count('* as total')
    assert.equal(Number(row.$extras.total), 1)
  })

  test('POST /admin/sync/sets redirige si l\'API échoue', async ({ client, assert }) => {
    const admin = await createAdmin()
    globalThis.fetch = makeFetch({}, false)

    const response = await client.post('/admin/sync/sets').loginAs(admin)
    response.assertRedirectsTo('/admin/sync')

    // Aucun set ne doit avoir été créé
    const [row] = await Set.query().count('* as total')
    assert.equal(Number(row.$extras.total), 0)
  })
})

test.group('Sync > synchronisation des cartes', (group) => {
  let savedFetch: typeof globalThis.fetch

  group.each.setup(() => cleanData())
  group.each.setup(() => { savedFetch = globalThis.fetch })
  group.each.teardown(() => { globalThis.fetch = savedFetch })

  test('POST /admin/sync/cards/:setId crée les cartes et redirige', async ({ client }) => {
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
          rarity: 'L',
          variant: null,
          image_url: 'https://img/c1.png',
          set: { slug: 'OP-01' },
        },
      ],
    })

    const response = await client.post(`/admin/sync/cards/${set.externalId}`).loginAs(admin)
    response.assertRedirectsTo('/admin/sync')
  })

  test('POST /admin/sync/cards/:setId redirige si le set est inconnu', async ({
    client,
  }) => {
    const admin = await createAdmin()

    const response = await client.post('/admin/sync/cards/INCONNU').loginAs(admin)
    response.assertRedirectsTo('/admin/sync')
  })
})

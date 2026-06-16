import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Set from '#models/set'
import Card from '#models/card'
import UserCard from '#models/user_card'

async function cleanData() {
  await db.rawQuery('TRUNCATE users_cards, cards, sets, users RESTART IDENTITY CASCADE')
}

async function createUser(overrides: Partial<{ email: string; username: string }> = {}) {
  return User.create({
    email: overrides.email ?? 'user@example.com',
    password: 'password123',
    username: overrides.username ?? 'testuser',
    firstName: 'Test',
  })
}

async function createSetWithCard() {
  const set = await Set.create({
    externalId: 'OP01',
    name: 'Romance Dawn',
    code: 'OP-01',
    totalCards: 3,
  })
  const card = await Card.create({
    externalId: 'c1',
    setId: set.id,
    name: 'Monkey D. Luffy',
    number: 'OP01-001',
    rarity: 'L',
    imageUrl: 'https://img/c1.png',
  })
  return { set, card }
}

test.group('Collection > middleware auth', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection redirige vers /login si non connecté', async ({ client }) => {
    const response = await client.get('/collection')
    response.assertRedirectsTo('/login')
  })

  test('POST /collection redirige vers /login si non connecté', async ({ client }) => {
    const response = await client.post('/collection').form({ cardId: 1 })
    response.assertRedirectsTo('/login')
  })
})

test.group('Collection > index', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection retourne 200 pour un utilisateur connecté', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/collection').loginAs(user)
    response.assertStatus(200)
  })

  test('GET /collection avec filtre par set retourne 200', async ({ client }) => {
    const user = await createUser()
    const { set } = await createSetWithCard()

    const response = await client.get('/collection').qs({ setId: set.id }).loginAs(user)
    response.assertStatus(200)
  })
})

test.group('Collection > ajout de carte', (group) => {
  group.each.setup(() => cleanData())

  test('POST /collection ajoute la carte avec quantité 1', async ({ client, assert }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()

    // redirect().back() sans Referer → "/"  (le client suit la redirection → 200 final)
    await client.post('/collection').form({ cardId: card.id }).loginAs(user)

    const userCard = await UserCard.query()
      .where('userId', user.id)
      .where('cardId', card.id)
      .first()
    assert.isNotNull(userCard)
    assert.equal(userCard!.quantity, 1)
  })

  test('POST /collection ne crée pas de doublon si la carte est déjà présente', async ({
    client,
    assert,
  }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()

    await client.post('/collection').form({ cardId: card.id }).loginAs(user)
    await client.post('/collection').form({ cardId: card.id }).loginAs(user)

    const [row] = await UserCard.query()
      .where('userId', user.id)
      .where('cardId', card.id)
      .count('* as total')
    assert.equal(Number(row.$extras.total), 1)
  })
})

test.group('Collection > mise à jour de quantité', (group) => {
  group.each.setup(() => cleanData())

  test('PATCH /collection/:id met à jour la quantité', async ({ client, assert }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: user.id, cardId: card.id, quantity: 1 })

    const response = await client
      .patch(`/collection/${userCard.id}`)
      .form({ quantity: 3 })
      .loginAs(user)

    response.assertRedirectsTo('/collection')
    await userCard.refresh()
    assert.equal(userCard.quantity, 3)
  })

  test('PATCH /collection/:id retourne 404 si la carte appartient à un autre utilisateur', async ({
    client,
  }) => {
    const user = await createUser()
    const other = await createUser({ email: 'other@example.com', username: 'other' })
    const { card } = await createSetWithCard()
    const otherCard = await UserCard.create({ userId: other.id, cardId: card.id, quantity: 1 })

    const response = await client
      .patch(`/collection/${otherCard.id}`)
      .form({ quantity: 5 })
      .loginAs(user)

    response.assertStatus(404)
  })
})

test.group('Collection > suppression', (group) => {
  group.each.setup(() => cleanData())

  test('DELETE /collection/:id supprime la carte de la collection', async ({ client, assert }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: user.id, cardId: card.id, quantity: 1 })

    await client.delete(`/collection/${userCard.id}`).loginAs(user)

    const found = await UserCard.find(userCard.id)
    assert.isNull(found)
  })

  test('DELETE /collection/:id retourne 404 si la carte appartient à un autre utilisateur', async ({
    client,
  }) => {
    const user = await createUser()
    const other = await createUser({ email: 'other@example.com', username: 'other' })
    const { card } = await createSetWithCard()
    const otherCard = await UserCard.create({ userId: other.id, cardId: card.id, quantity: 1 })

    const response = await client.delete(`/collection/${otherCard.id}`).loginAs(user)
    response.assertStatus(404)
  })
})

test.group('Collection > cartes manquantes', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection/missing/:id retourne 200', async ({ client }) => {
    const user = await createUser()
    const { set } = await createSetWithCard()

    const response = await client.get(`/collection/missing/${set.id}`).loginAs(user)
    response.assertStatus(200)
  })

  test('GET /collection/missing/:id retourne 404 si le set n\'existe pas', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/collection/missing/99999').loginAs(user)
    response.assertStatus(404)
  })
})

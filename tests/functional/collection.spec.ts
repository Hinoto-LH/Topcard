import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Set from '#models/set'
import Card from '#models/card'
import UserCard from '#models/user_card'

async function cleanData() {
  await db.rawQuery('DELETE FROM users_cards')
  await db.rawQuery('DELETE FROM cards')
  await db.rawQuery('DELETE FROM sets')
  await db.rawQuery('DELETE FROM users')
}

async function createUser(overrides: Partial<{ email: string; username: string }> = {}) {
  return User.create({
    email: overrides.email ?? 'user@example.com',
    password: 'Password123!',
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
    rarity: 'Leader',
    imageUrl: 'https://img/c1.png',
  })
  return { set, card }
}

test.group('Collection > middleware auth', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection retourne 401 si non connecté', async ({ client }) => {
    const response = await client.get('/collection')
    response.assertStatus(401)
  })

  test('POST /collection retourne 401 si non connecté', async ({ client }) => {
    const response = await client.post('/collection').json({ cardId: 1 })
    response.assertStatus(401)
  })
})

test.group('Collection > index', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection retourne 200 + userCards + sets', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client.get('/collection').loginAs(user)

    response.assertStatus(200)
    assert.properties(response.body(), ['userCards', 'sets'])
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

    const response = await client.post('/collection').json({ cardId: card.id }).loginAs(user)

    response.assertStatus(200)
    assert.isTrue(response.body().ok)

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

    await client.post('/collection').json({ cardId: card.id }).loginAs(user)
    await client.post('/collection').json({ cardId: card.id }).loginAs(user)

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
      .json({ quantity: 3 })
      .loginAs(user)

    response.assertStatus(200)
    await userCard.refresh()
    assert.equal(userCard.quantity, 3)
  })

  test('PATCH /collection/:id refuse une quantité < 1 (422)', async ({ client }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: user.id, cardId: card.id, quantity: 1 })

    const response = await client
      .patch(`/collection/${userCard.id}`)
      .json({ quantity: 0 })
      .loginAs(user)

    response.assertStatus(422)
  })

  test('PATCH /collection/:id d\'un autre utilisateur retourne 404', async ({ client }) => {
    const owner = await createUser({ email: 'owner@example.com', username: 'owner' })
    const intruder = await createUser({ email: 'intruder@example.com', username: 'intruder' })
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: owner.id, cardId: card.id, quantity: 1 })

    const response = await client
      .patch(`/collection/${userCard.id}`)
      .json({ quantity: 5 })
      .loginAs(intruder)

    response.assertStatus(404)
  })
})

test.group('Collection > suppression', (group) => {
  group.each.setup(() => cleanData())

  test('DELETE /collection/:id supprime la ligne', async ({ client, assert }) => {
    const user = await createUser()
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: user.id, cardId: card.id, quantity: 1 })

    const response = await client.delete(`/collection/${userCard.id}`).loginAs(user)

    response.assertStatus(200)
    const found = await UserCard.find(userCard.id)
    assert.isNull(found)
  })

  test('DELETE /collection/:id d\'un autre utilisateur retourne 404', async ({ client, assert }) => {
    const owner = await createUser({ email: 'owner@example.com', username: 'owner' })
    const intruder = await createUser({ email: 'intruder@example.com', username: 'intruder' })
    const { card } = await createSetWithCard()
    const userCard = await UserCard.create({ userId: owner.id, cardId: card.id, quantity: 1 })

    const response = await client.delete(`/collection/${userCard.id}`).loginAs(intruder)

    response.assertStatus(404)
    // La ligne du propriétaire ne doit pas avoir été supprimée.
    const stillThere = await UserCard.find(userCard.id)
    assert.isNotNull(stillThere)
  })
})

test.group('Collection > cartes manquantes', (group) => {
  group.each.setup(() => cleanData())

  test('GET /collection/missing/:id retourne set, missCards et completion', async ({
    client,
    assert,
  }) => {
    const user = await createUser()
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 2,
    })
    const card1 = await Card.create({
      externalId: 'c1',
      setId: set.id,
      name: 'Luffy',
      number: 'OP01-001',
      rarity: 'Leader',
      imageUrl: 'u',
    })
    await Card.create({
      externalId: 'c2',
      setId: set.id,
      name: 'Zoro',
      number: 'OP01-002',
      rarity: 'Super Rare',
      imageUrl: 'u',
    })
    await UserCard.create({ userId: user.id, cardId: card1.id, quantity: 1 })

    const response = await client.get(`/collection/missing/${set.id}`).loginAs(user)

    response.assertStatus(200)
    // 1 carte possédée sur 2 → 50 % ; la carte manquante est Zoro.
    assert.equal(response.body().completion, 50)
    assert.lengthOf(response.body().missCards, 1)
    assert.equal(response.body().missCards[0].name, 'Zoro')
  })
})

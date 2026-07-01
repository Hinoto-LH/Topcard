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

async function createUser() {
  return User.create({
    email: 'user@example.com',
    password: 'Password123!',
    username: 'testuser',
    firstName: 'Test',
  })
}

test.group('Sets > liste', (group) => {
  group.each.setup(() => cleanData())

  test('GET /sets retourne 200 sans être connecté', async ({ client, assert }) => {
    const response = await client.get('/sets')
    response.assertStatus(200)
    assert.isArray(response.body().sets)
  })

  test('GET /sets retourne les sets existants', async ({ client, assert }) => {
    await Set.create({ externalId: 'OP01', name: 'Romance Dawn', code: 'OP-01', totalCards: 102 })
    await Set.create({ externalId: 'OP02', name: 'Paramount War', code: 'OP-02', totalCards: 121 })

    const response = await client.get('/sets')

    response.assertStatus(200)
    assert.lengthOf(response.body().sets, 2)
  })
})

test.group('Sets > détail', (group) => {
  group.each.setup(() => cleanData())

  test('GET /sets/:id retourne 200 pour un utilisateur connecté', async ({ client }) => {
    const user = await createUser()
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 2,
    })

    const response = await client.get(`/sets/${set.id}`).loginAs(user)
    response.assertStatus(200)
  })

  test('GET /sets/:id retourne 404 si le set n\'existe pas', async ({ client }) => {
    const user = await createUser()
    const response = await client.get('/sets/99999').loginAs(user)
    response.assertStatus(404)
  })

  test('GET /sets/:id inclut ownerCardsIds et completion pour l\'utilisateur', async ({
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

    const response = await client.get(`/sets/${set.id}`).loginAs(user)

    response.assertStatus(200)
    assert.include(response.body().ownerCardsIds, card1.id)
    // 1 carte sur 2 possédée → 50 %
    assert.equal(response.body().completion, 50)
  })

  test('GET /sets/:id renvoie ownerCardsIds vide pour un visiteur non connecté', async ({
    client,
    assert,
  }) => {
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })

    const response = await client.get(`/sets/${set.id}`)

    response.assertStatus(200)
    assert.isEmpty(response.body().ownerCardsIds)
    assert.equal(response.body().completion, 0)
  })
})

test.group('Cards > détail', (group) => {
  group.each.setup(() => cleanData())

  test('GET /cards/:id retourne la carte (owned=0) pour un visiteur', async ({ client, assert }) => {
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })
    const card = await Card.create({
      externalId: 'c1',
      setId: set.id,
      name: 'Luffy',
      number: 'OP01-001',
      rarity: 'Leader',
      imageUrl: 'u',
    })

    const response = await client.get(`/cards/${card.id}`)

    response.assertStatus(200)
    assert.equal(response.body().card.id, card.id)
    assert.equal(response.body().owned, 0)
    assert.isNull(response.body().userCardId)
  })

  test('GET /cards/:id reflète la possession pour un utilisateur connecté', async ({
    client,
    assert,
  }) => {
    const user = await createUser()
    const set = await Set.create({
      externalId: 'OP01',
      name: 'Romance Dawn',
      code: 'OP-01',
      totalCards: 1,
    })
    const card = await Card.create({
      externalId: 'c1',
      setId: set.id,
      name: 'Luffy',
      number: 'OP01-001',
      rarity: 'Leader',
      imageUrl: 'u',
    })
    await UserCard.create({ userId: user.id, cardId: card.id, quantity: 2 })

    const response = await client.get(`/cards/${card.id}`).loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().owned, 2)
    assert.isNotNull(response.body().userCardId)
  })

  test('GET /cards/:id retourne 404 si la carte n\'existe pas', async ({ client }) => {
    const response = await client.get('/cards/99999')
    response.assertStatus(404)
  })
})

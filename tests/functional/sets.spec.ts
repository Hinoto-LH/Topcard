import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Set from '#models/set'
import Card from '#models/card'
import UserCard from '#models/user_card'

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

test.group('Sets > liste', (group) => {
  group.each.setup(() => cleanData())

  test('GET /sets retourne 200 sans être connecté', async ({ client }) => {
    const response = await client.get('/sets')
    response.assertStatus(200)
  })

  test('GET /sets retourne 200 quand des sets existent', async ({ client }) => {
    await Set.create({ externalId: 'OP01', name: 'Romance Dawn', code: 'OP-01', totalCards: 102 })
    await Set.create({ externalId: 'OP02', name: 'Paramount War', code: 'OP-02', totalCards: 121 })

    const response = await client.get('/sets')
    response.assertStatus(200)
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

  test('GET /sets/:id inclut les cartes possédées par l\'utilisateur', async ({ client, assert }) => {
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
      rarity: 'L',
      imageUrl: 'u',
    })
    await Card.create({
      externalId: 'c2',
      setId: set.id,
      name: 'Zoro',
      number: 'OP01-002',
      rarity: 'SR',
      imageUrl: 'u',
    })
    await UserCard.create({ userId: user.id, cardId: card1.id, quantity: 1 })

    // Inertia renvoie JSON si on envoie le header X-Inertia
    const response = await client
      .get(`/sets/${set.id}`)
      .header('X-Inertia', 'true')
      .header('X-Inertia-Version', '1')
      .loginAs(user)

    response.assertStatus(200)
    assert.include(response.body().props.ownerCardsIds, card1.id)
    // 1 carte sur 2 possédée → 50%
    assert.equal(response.body().props.completion, 50)
  })
})

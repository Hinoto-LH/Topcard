import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

async function cleanData() {
  await db.rawQuery('TRUNCATE users_cards, cards, sets, users RESTART IDENTITY CASCADE')
}

test.group('Auth > pages publiques', (group) => {
  group.each.setup(() => cleanData())

  test('GET /login retourne 200', async ({ client }) => {
    const response = await client.get('/login')
    response.assertStatus(200)
  })

  test('GET /signup retourne 200', async ({ client }) => {
    const response = await client.get('/signup')
    response.assertStatus(200)
  })
})

test.group('Auth > connexion', (group) => {
  group.each.setup(() => cleanData())

  test('POST /login avec identifiants valides redirige vers /', async ({ client }) => {
    await User.create({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
    })

    const response = await client.post('/login').form({
      email: 'test@example.com',
      password: 'password123',
    })

    response.assertRedirectsTo('/')
  })

  test('POST /login avec mauvais mot de passe ne crée pas de session', async ({ client }) => {
    await User.create({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
    })

    // Échec de connexion — le cookie de session ne doit pas contenir d'auth
    await client.post('/login').form({ email: 'test@example.com', password: 'mauvais_mdp' })

    // L'accès à une route protégée doit toujours rediriger vers /login
    const check = await client.get('/collection')
    check.assertRedirectsTo('/login')
  })

  test('POST /login avec email inconnu ne crée pas de session', async ({ client }) => {
    await client.post('/login').form({ email: 'inconnu@example.com', password: 'password123' })

    const check = await client.get('/collection')
    check.assertRedirectsTo('/login')
  })
})

test.group('Auth > déconnexion', (group) => {
  group.each.setup(() => cleanData())

  test('POST /logout déconnecte et redirige vers /login', async ({ client }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
    })

    const response = await client.post('/logout').loginAs(user)
    response.assertRedirectsTo('/login')
  })
})

test.group('Auth > middleware guest', (group) => {
  group.each.setup(() => cleanData())

  test('GET /login redirige vers / si déjà connecté', async ({ client }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
    })

    const response = await client.get('/login').loginAs(user)
    response.assertRedirectsTo('/')
  })

  test('GET /signup redirige vers / si déjà connecté', async ({ client }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'Test',
    })

    const response = await client.get('/signup').loginAs(user)
    response.assertRedirectsTo('/')
  })
})

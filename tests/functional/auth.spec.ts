import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

// SQLite en test : pas de TRUNCATE. On supprime les lignes enfant → parent.
// Les rôles ne sont pas touchés (seedés une fois au bootstrap).
async function cleanData() {
  await db.rawQuery('DELETE FROM users_cards')
  await db.rawQuery('DELETE FROM cards')
  await db.rawQuery('DELETE FROM sets')
  await db.rawQuery('DELETE FROM users')
}

// Mot de passe respectant les règles du signupValidator (min/maj/chiffre/spécial).
const PASSWORD = 'Password123!'

async function createUser() {
  return User.create({
    email: 'test@example.com',
    password: PASSWORD,
    username: 'testuser',
    firstName: 'Test',
  })
}

test.group('Auth > inscription', (group) => {
  group.each.setup(() => cleanData())

  test('POST /signup crée le compte, le connecte et retourne le user', async ({ client, assert }) => {
    const response = await client.post('/signup').json({
      username: 'luffy',
      firstName: 'Monkey',
      email: 'luffy@example.com',
      password: PASSWORD,
      passwordConfirmation: PASSWORD,
    })

    response.assertStatus(200)
    // `role` (= roleId) est absent du JSON quand roleId est undefined à l'inscription.
    assert.properties(response.body().user, ['id', 'email'])

    const created = await User.findBy('username', 'luffy')
    assert.isNotNull(created)
  })

  test('POST /signup refuse un mot de passe trop faible (422)', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: 'zoro',
      firstName: 'Roronoa',
      email: 'zoro@example.com',
      password: 'weak',
      passwordConfirmation: 'weak',
    })

    response.assertStatus(422)
  })

  test('POST /signup refuse un username déjà pris (422)', async ({ client }) => {
    await createUser() // username: testuser

    const response = await client.post('/signup').json({
      username: 'testuser',
      firstName: 'Autre',
      email: 'autre@example.com',
      password: PASSWORD,
      passwordConfirmation: PASSWORD,
    })

    response.assertStatus(422)
  })
})

test.group('Auth > connexion', (group) => {
  group.each.setup(() => cleanData())

  test('POST /login avec identifiants valides retourne 200 + user', async ({ client, assert }) => {
    await createUser()

    const response = await client.post('/login').json({ username: 'testuser', password: PASSWORD })

    response.assertStatus(200)
    assert.equal(response.body().user.email, 'test@example.com')
  })

  test('POST /login avec mauvais mot de passe échoue et ne crée pas de session', async ({
    client,
  }) => {
    await createUser()

    await client.post('/login').json({ username: 'testuser', password: 'MauvaisMdp1!' })

    // La session ne doit pas être ouverte → route protégée toujours refusée (401).
    const check = await client.get('/collection')
    check.assertStatus(401)
  })

  test('POST /login avec username inconnu ne crée pas de session', async ({ client }) => {
    await client.post('/login').json({ username: 'inconnu', password: PASSWORD })

    const check = await client.get('/collection')
    check.assertStatus(401)
  })
})

test.group('Auth > session', (group) => {
  group.each.setup(() => cleanData())

  test('GET /me retourne 401 si non connecté', async ({ client }) => {
    const response = await client.get('/me')
    response.assertStatus(401)
  })

  test('GET /me retourne l\'utilisateur connecté', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client.get('/me').loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().user.id, user.id)
  })

  test('POST /logout déconnecte et retourne { ok: true }', async ({ client, assert }) => {
    const user = await createUser()

    const response = await client.post('/logout').loginAs(user)

    response.assertStatus(200)
    assert.isTrue(response.body().ok)
  })
})

test.group('Auth > middleware guest', (group) => {
  group.each.setup(() => cleanData())

  test('POST /login redirige si l\'utilisateur est déjà connecté', async ({ client }) => {
    const user = await createUser()

    const response = await client
      .post('/login')
      .json({ username: 'testuser', password: PASSWORD })
      .loginAs(user)

    // guest middleware → redirection vers '/'
    response.assertRedirectsTo('/')
  })
})

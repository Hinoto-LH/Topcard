/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// Routes admin : double middleware — auth() vérifie la connexion, admin() vérifie le rôle.
// Les POST /admin/sync/* sont exemptés du CSRF dans config/shield.ts (appels API internes).
router
  .group(() => {
    router.get('/admin/sync', [controllers.Syncs, 'index'])
    router.post('/admin/sync/sets', [controllers.Syncs, 'syncSets'])
    router.post('/admin/sync/cards/:setId', [controllers.Syncs, 'syncCards'])
  })
  .use(middleware.auth())
  .use(middleware.admin())

router
  .group(() => {
    router.post('signup', [controllers.NewAccount, 'store'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

// Route Collection
router
.group(() => {
  router.get('/collection', [controllers.Collections, 'index'])
  router.post('/collection', [controllers.Collections, 'store'])
  router.patch('/collection/:id', [controllers.Collections, 'update'])
  router.delete('/collection/:id', [controllers.Collections, 'destroy'])
  router.get('/collection/missing/:id', [controllers.Collections, 'missing'])
})
.use(middleware.auth())

// Routes sets : publiques — silent_auth_middleware peuple auth.user si connecté
// pour que show() puisse calculer la complétion sans bloquer les visiteurs.
router.group(() => {
  router.get('/sets', [controllers.Sets, 'index'])
  router.get('/sets/:id', [controllers.Sets, 'show'])
})

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('me', [controllers.Me, 'show'])
  })
  .use(middleware.auth())

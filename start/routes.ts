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

router.on('/').renderInertia('home', {}).as('home')

// Route Admin
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
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
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
})
.use(middleware.auth())

// Route Set
router.group(() => {
  router.get('/sets', [controllers.Sets, 'index'])
  router.get('/sets/:id', [controllers.Sets, 'show'])
})

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())


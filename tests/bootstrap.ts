import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { apiClient, ApiClient } from '@japa/api-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { dbAssertions } from '@adonisjs/lucid/plugins/db'
import testUtils from '@adonisjs/core/services/test_utils'
import { browserClient } from '@japa/browser-client'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'

// Le client de test envoie systématiquement `Accept: application/json`, comme le
// HttpClient d'Angular. Sans cet en-tête, la négociation de contenu d'AdonisJS ne
// rend pas les erreurs de validation en JSON (422) — elle retombe sur un 404.
ApiClient.onRequest((request) => request.accept('json'))

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  dbAssertions(app),
  apiClient(),
  sessionApiClient(app),
  authApiClient(app),
  browserClient({ runInSuites: ['browser'] }),
  sessionBrowserClient(app),
  authBrowserClient(app),
]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    async () => {
      // Migrations (idempotent) + seeding des données de référence (roles)
      // On ne truncate PAS pour ne pas détruire les données de développement.
      // Les tests utilisent withGlobalTransaction() pour l'isolation.
      await testUtils.db().migrate()
      const Role = (await import('#models/role')).default
      const count = await Role.query().count('* as total')
      if (Number(count[0].$extras.total) === 0) {
        await Role.createMany([{ name: 'admin' }, { name: 'user' }, { name: 'pro' }])
      }
    },
  ],
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}

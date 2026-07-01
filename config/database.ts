import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'
import app from '@adonisjs/core/services/app'

const dbConfig = defineConfig({
  // En test, on bascule sur SQLite (base jetable dans tmp/) pour que la suite
  // soit auto-suffisante et ne nécessite pas un PostgreSQL en cours d'exécution.
  // En dev/prod, on reste sur PostgreSQL.
  connection: app.inTest ? 'sqlite' : 'pg',

  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },

    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig

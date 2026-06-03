import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // données fixes requises au démarrage de l'app
    await db.table('roles').multiInsert([
      { name: 'admin' },
      { name: 'user' },
      { name: 'pro' }, // réservé pour une future feature premium
    ])
  }
}
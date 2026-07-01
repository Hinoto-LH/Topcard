import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // données fixes requises au démarrage de l'app
    // NB : le rôle 'pro' est réservé pour une fonctionnalité à venir — il n'est pas
    // encore exploité (aucune route/middleware ne le distingue de 'user').
    await db
      .table('roles')
      .insert([{ name: 'admin' }, { name: 'user' }, { name: 'pro' }])
      .onConflict('name')
      .ignore()
  }
}
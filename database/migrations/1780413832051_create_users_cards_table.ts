import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id')
      table.integer('card_id').unsigned().notNullable()
      table.foreign('card_id').references('cards.id')
      table.unique(['user_id', 'card_id']) // empêche qu'un utilisateur ait deux lignes pour la même carte
      table.integer('quantity').unsigned().notNullable().defaultTo(1) // nombre d'exemplaires, minimum 1

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
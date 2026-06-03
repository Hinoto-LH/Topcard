import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username', 80).notNullable().unique()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).nullable() // optionnel, l'utilisateur peut ne pas le renseigner
      table.string('email', 254).notNullable().unique() // 254 = limite RFC 5321
      table.string('password').notNullable() // sans limite de taille : bcrypt et autres algos varient

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

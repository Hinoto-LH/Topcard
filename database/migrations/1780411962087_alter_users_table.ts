import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('role_id').unsigned().nullable() // nullable : le rôle est assigné par le controller à l'inscription
      table.foreign('role_id').references('roles.id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['role_id'])
      table.dropColumn('role_id')
    })
  }
}
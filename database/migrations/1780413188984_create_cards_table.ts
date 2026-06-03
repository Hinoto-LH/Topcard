import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('external_id').notNullable().unique()
      table.integer('set_id').unsigned().notNullable()
      table.foreign('set_id').references('sets.id')
      table.string('name').notNullable()
      table.string('number').notNullable()
      table.string('set_code').notNullable()
      table.string('rarity').notNullable()
      table.string('image_url').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
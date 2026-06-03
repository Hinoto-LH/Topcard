import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('external_id').notNullable().unique() // id côté OPTCG API, permet de changer d'API sans modifier le schéma
      table.string('name').notNullable()
      table.string('code').notNullable().unique() // ex: "OP01", unique car identifie le set
      table.integer('total_cards').nullable() // peut être inconnu selon l'API

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
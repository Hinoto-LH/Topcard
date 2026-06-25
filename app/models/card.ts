import { CardSchema } from '#database/schema'
import { manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Set from '#models/set'

export default class Card extends CardSchema {

  // Chaque carte appartient à un set (clé étrangère setId).
  @belongsTo(() => Set)
  declare set: BelongsTo<typeof Set>

  // Relation many-to-many avec User via la table pivot users_cards.
  // pivotColumns: ['quantity'] expose la colonne quantity du pivot dans les requêtes.
  @manyToMany(() => User, {
    pivotTable: 'users_cards',
    pivotColumns: ['quantity'],
  })
  declare owners: ManyToMany<typeof User>
}

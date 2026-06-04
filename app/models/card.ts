import { CardSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Set from '#models/set'

export default class Card extends CardSchema {
    @belongsTo(() => Set)
    declare set: BelongsTo<typeof Set>

    @manyToMany(() => User, {
        pivotTable: 'users_cards',
        pivotColumns: ['quantity'],
    })
    declare owners: ManyToMany<typeof User>
}
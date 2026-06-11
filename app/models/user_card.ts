import { UsersCardSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Card from '#models/card'

export default class UserCard extends UsersCardSchema {
    static table = 'users_cards'
    
    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Card)
    declare card: BelongsTo<typeof Card>
}
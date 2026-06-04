import { SetSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Card from '#models/card'

export default class Set extends SetSchema {
    @hasMany(() => Card)
    declare cards: HasMany<typeof Card>
}
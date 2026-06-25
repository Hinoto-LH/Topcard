import { SetSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Card from '#models/card'

export default class Set extends SetSchema {

  // Un set contient plusieurs cartes.
  // La relation n'est chargée que si on appelle .preload('cards') dans la query.
  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>
}

import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from "#models/role"

// withAuthFinder ajoute verifyCredentials() au modèle : recherche par email
// et vérifie le hash du mot de passe via le service `hash` configuré (argon2).
// compose() est nécessaire pour combiner plusieurs mixins sans conflit TypeScript.
// uids: ['username'] → verifyCredentials() cherche par username au lieu d'email
export default class User extends compose(UserSchema, withAuthFinder(hash, { uids: ['username'] })) {

  // Relation vers le modèle Role (roleId en colonne).
  // ATTENTION : cette relation est undefined jusqu'à un appel explicite à user.load('role').
  // Pour les vérifications rapides de rôle dans les controllers, utiliser user.roleId directement.
  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>
}

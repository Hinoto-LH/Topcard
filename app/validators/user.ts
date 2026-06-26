import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () =>
  vine
    .string()
    .minLength(8)
    .maxLength(64)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  username: vine.string().minLength(3).maxLength(80).unique({ table: 'users', column: 'username' }),
  firstName: vine.string().maxLength(100),
  lastName: vine.string().maxLength(100).nullable().optional(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

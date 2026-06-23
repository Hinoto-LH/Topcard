import vine from '@vinejs/vine'

export const updateQuantityValidator = vine.create({
  quantity: vine.number().min(1).max(9999),
})

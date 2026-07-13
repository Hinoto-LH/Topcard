import vine from '@vinejs/vine'

export const updateQuantityValidator = vine.create({
  quantity: vine.number().min(1).max(9999),
})

export const storeCardValidator = vine.create({
  cardId: vine.number().min(1),
})

// Forme du JSON retourné par le SetTransformer AdonisJS
export interface Set {
  id: number
  externalId: string
  name: string
  code: string
  totalCards: number | null
}

// Carte telle que retournée par la base de données
export interface Card {
  id: number
  externalId: string
  name: string
  number: string
  rarity: string
  setId: number
  imageUrl: string
  variant: string | null
}

// Carte avec son set inclus (utilisé dans la collection)
export interface CardWithSet extends Card {
  set: Set
}

// Ligne de collection : une carte appartenant à un utilisateur avec sa quantité
export interface UserCard {
  id: number
  cardId: number
  userId: number
  quantity: number
  card?: CardWithSet
}

// Utilisateur connecté (renvoyé par login/signup/me)
export interface User {
  id: number
  email: string
  role: number | null
}

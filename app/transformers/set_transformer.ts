import type Set from '#models/set'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SetTransformer extends BaseTransformer<Set> {
  toObject() {
    return this.pick(this.resource, ['id', 'externalId', 'name', 'code', 'totalCards'])
  }
}

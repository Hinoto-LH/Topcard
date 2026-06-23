/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  syncs: {
    index: typeof routes['syncs.index']
    syncSets: typeof routes['syncs.sync_sets']
    syncCards: typeof routes['syncs.sync_cards']
  }
  newAccount: {
    store: typeof routes['new_account.store']
  }
  session: {
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  collections: {
    index: typeof routes['collections.index']
    store: typeof routes['collections.store']
    update: typeof routes['collections.update']
    destroy: typeof routes['collections.destroy']
    missing: typeof routes['collections.missing']
  }
  sets: {
    index: typeof routes['sets.index']
    show: typeof routes['sets.show']
  }
  me: {
    show: typeof routes['me.show']
  }
}

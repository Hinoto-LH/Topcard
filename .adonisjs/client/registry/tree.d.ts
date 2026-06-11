/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  syncs: {
    index: typeof routes['syncs.index']
    syncSets: typeof routes['syncs.sync_sets']
    syncCards: typeof routes['syncs.sync_cards']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  collections: {
    index: typeof routes['collections.index']
    store: typeof routes['collections.store']
    update: typeof routes['collections.update']
    destroy: typeof routes['collections.destroy']
  }
  sets: {
    index: typeof routes['sets.index']
    show: typeof routes['sets.show']
  }
}

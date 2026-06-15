/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'syncs.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/sync',
    tokens: [{"old":"/admin/sync","type":0,"val":"admin","end":""},{"old":"/admin/sync","type":0,"val":"sync","end":""}],
    types: placeholder as Registry['syncs.index']['types'],
  },
  'syncs.sync_sets': {
    methods: ["POST"],
    pattern: '/admin/sync/sets',
    tokens: [{"old":"/admin/sync/sets","type":0,"val":"admin","end":""},{"old":"/admin/sync/sets","type":0,"val":"sync","end":""},{"old":"/admin/sync/sets","type":0,"val":"sets","end":""}],
    types: placeholder as Registry['syncs.sync_sets']['types'],
  },
  'syncs.sync_cards': {
    methods: ["POST"],
    pattern: '/admin/sync/cards/:setId',
    tokens: [{"old":"/admin/sync/cards/:setId","type":0,"val":"admin","end":""},{"old":"/admin/sync/cards/:setId","type":0,"val":"sync","end":""},{"old":"/admin/sync/cards/:setId","type":0,"val":"cards","end":""},{"old":"/admin/sync/cards/:setId","type":1,"val":"setId","end":""}],
    types: placeholder as Registry['syncs.sync_cards']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'collections.index': {
    methods: ["GET","HEAD"],
    pattern: '/collection',
    tokens: [{"old":"/collection","type":0,"val":"collection","end":""}],
    types: placeholder as Registry['collections.index']['types'],
  },
  'collections.store': {
    methods: ["POST"],
    pattern: '/collection',
    tokens: [{"old":"/collection","type":0,"val":"collection","end":""}],
    types: placeholder as Registry['collections.store']['types'],
  },
  'collections.update': {
    methods: ["PATCH"],
    pattern: '/collection/:id',
    tokens: [{"old":"/collection/:id","type":0,"val":"collection","end":""},{"old":"/collection/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['collections.update']['types'],
  },
  'collections.destroy': {
    methods: ["DELETE"],
    pattern: '/collection/:id',
    tokens: [{"old":"/collection/:id","type":0,"val":"collection","end":""},{"old":"/collection/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['collections.destroy']['types'],
  },
  'collections.missing': {
    methods: ["GET","HEAD"],
    pattern: '/collection/missing/:id',
    tokens: [{"old":"/collection/missing/:id","type":0,"val":"collection","end":""},{"old":"/collection/missing/:id","type":0,"val":"missing","end":""},{"old":"/collection/missing/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['collections.missing']['types'],
  },
  'sets.index': {
    methods: ["GET","HEAD"],
    pattern: '/sets',
    tokens: [{"old":"/sets","type":0,"val":"sets","end":""}],
    types: placeholder as Registry['sets.index']['types'],
  },
  'sets.show': {
    methods: ["GET","HEAD"],
    pattern: '/sets/:id',
    tokens: [{"old":"/sets/:id","type":0,"val":"sets","end":""},{"old":"/sets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sets.show']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}

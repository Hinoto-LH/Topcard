import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'syncs.index': { paramsTuple?: []; params?: {} }
    'syncs.sync_sets': { paramsTuple?: []; params?: {} }
    'syncs.sync_cards': { paramsTuple: [ParamValue]; params: {'setId': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'collections.index': { paramsTuple?: []; params?: {} }
    'collections.export': { paramsTuple?: []; params?: {} }
    'collections.store': { paramsTuple?: []; params?: {} }
    'collections.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'collections.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'collections.missing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sets.index': { paramsTuple?: []; params?: {} }
    'sets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'me.show': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'syncs.index': { paramsTuple?: []; params?: {} }
    'collections.index': { paramsTuple?: []; params?: {} }
    'collections.export': { paramsTuple?: []; params?: {} }
    'collections.missing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sets.index': { paramsTuple?: []; params?: {} }
    'sets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'me.show': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'syncs.index': { paramsTuple?: []; params?: {} }
    'collections.index': { paramsTuple?: []; params?: {} }
    'collections.export': { paramsTuple?: []; params?: {} }
    'collections.missing': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sets.index': { paramsTuple?: []; params?: {} }
    'sets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cards.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'me.show': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'syncs.sync_sets': { paramsTuple?: []; params?: {} }
    'syncs.sync_cards': { paramsTuple: [ParamValue]; params: {'setId': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'collections.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'collections.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'collections.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
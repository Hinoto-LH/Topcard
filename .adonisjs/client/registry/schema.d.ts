/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'syncs.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/sync'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['index']>>>
    }
  }
  'syncs.sync_sets': {
    methods: ["POST"]
    pattern: '/admin/sync/sets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['syncSets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['syncSets']>>>
    }
  }
  'syncs.sync_cards': {
    methods: ["POST"]
    pattern: '/admin/sync/cards/:setId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { setId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['syncCards']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/syncs_controller').default['syncCards']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'collections.index': {
    methods: ["GET","HEAD"]
    pattern: '/collection'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['index']>>>
    }
  }
  'collections.export': {
    methods: ["GET","HEAD"]
    pattern: '/collection/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['export']>>>
    }
  }
  'collections.store': {
    methods: ["POST"]
    pattern: '/collection'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/collection').storeCardValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/collection').storeCardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'collections.update': {
    methods: ["PATCH"]
    pattern: '/collection/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/collection').updateQuantityValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/collection').updateQuantityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'collections.destroy': {
    methods: ["DELETE"]
    pattern: '/collection/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['destroy']>>>
    }
  }
  'collections.missing': {
    methods: ["GET","HEAD"]
    pattern: '/collection/missing/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['missing']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/collections_controller').default['missing']>>>
    }
  }
  'sets.index': {
    methods: ["GET","HEAD"]
    pattern: '/sets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sets_controller').default['index']>>>
    }
  }
  'sets.show': {
    methods: ["GET","HEAD"]
    pattern: '/sets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sets_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sets_controller').default['show']>>>
    }
  }
  'cards.show': {
    methods: ["GET","HEAD"]
    pattern: '/cards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['show']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'me.show': {
    methods: ["GET","HEAD"]
    pattern: '/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/me_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/me_controller').default['show']>>>
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
}

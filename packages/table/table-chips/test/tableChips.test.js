import { TableCollection } from '@foba/table'
import { decoEntries, decoTable, logger, says } from '@spare/logger'
import { tableChips } from '../src/tableChips'
import { ACCUM, MERGE } from '@analys/enum-pivot-mode'
import { deco } from '@spare/deco'

const { COUNT } = require('@analys/enum-pivot-mode')

const table = TableCollection.AeroEngineSpecs

table
  |> decoTable
  // |> DecoTable({ top: 3, bottom: 1 })
  |> logger

tableChips.call(table, {
  key: 'plant',
  field: 'sku',
  mode: ACCUM,
  objectify: true
})
  |> deco
  |> says['plant -> sku']
'' |> logger

tableChips.call(table, {
  key: 'country',
  field: 'sku2',
  mode: COUNT,
  objectify: false
})
  |> decoEntries
  |> says['plant -> sku2']
'' |> logger

tableChips.call(table, {
  key: 'country',
  field: 'app',
  mode: MERGE,
  objectify: true
})
  |> deco
  |> says['plant -> sku2']
'' |> logger


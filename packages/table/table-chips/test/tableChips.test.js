import { TableCollection } from '@foba/table'
import { decoEntries, decoTable, logger, says } from '@spare/logger'
import { tableChips } from '../src/tableChips'
import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { deco } from '@spare/deco'
import { Table } from '@analys/table'
import { isNumeric } from '@typen/num-strict'

const table = TableCollection.AeroEngineSpecs |> Table.from

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
  |> says['multiple category: plant -> sku']
'' |> logger

tableChips.call(table, {
  key: 'country',
  field: 'sku2',
  mode: COUNT,
  objectify: false
})
  |> decoEntries
  |> says['distinct count: plant -> sku2']
'' |> logger

tableChips.call(table, {
  key: 'country',
  field: 'app',
  mode: MERGE,
  objectify: true
})
  |> deco
  |> says['multiple category by merge: country -> app']
'' |> logger

table.mutateColumn('maxt', x => isNumeric(x) ? +x : 0)

tableChips.call(table, {
  key: 'plant',
  field: 'maxt',
  mode: INCRE,
  objectify: false
})
  |> decoEntries
  |> says['sum by keys: plant -> maxt']
'' |> logger



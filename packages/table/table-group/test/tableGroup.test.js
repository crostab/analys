import { ACCUM, INCRE, MERGE }     from '@analys/enum-pivot-mode'
import { Table }                   from '@analys/table'
import { TableCollection }         from '@foba/table'
import { decoTable, logger, says } from '@spare/logger'
import { tableGroup }              from '..'

const { COUNT } = require('@analys/enum-pivot-mode')

const table = TableCollection.AeroEngineSpecs |> Table.from

table|> decoTable|> logger

tableGroup.call(table, {
  key: { plant: x => x.toLowerCase() },
  field: {
    sku: ACCUM,
    app: MERGE,
    maxt: INCRE,
    bypass: COUNT,
  },
})
  |> decoTable
  |> says['multiple category: plant -> sku']
'' |> logger

tableGroup.call(table, {
  key: 'country',
  field: {
    sku: COUNT
  },
})
  |> decoTable
  |> says['multiple category: plant -> sku']
'' |> logger


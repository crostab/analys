import { TableCollection }         from '@foba/table'
import { decoTable, logger, says } from '@spare/logger'
import { ACCUM, INCRE, MERGE }     from '@analys/enum-pivot-mode'
import { Table }                   from '@analys/table'
import { tableGroup }              from '..'

const { COUNT } = require('@analys/enum-pivot-mode')

const table = TableCollection.AeroEngineSpecs |> Table.from

table|> decoTable|> logger

tableGroup.call(table, {
  key: 'plant',
  field: {
    sku: ACCUM,
    app: MERGE,
    maxt: INCRE,
    country: COUNT,
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


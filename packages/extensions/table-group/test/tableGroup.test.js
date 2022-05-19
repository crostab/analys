import { MUTABLE }                                             from '@analys/enum-mutabilities'
import { ACCUM, AVERAGE, COUNT, FIRST, LAST, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'
import { Table }                                               from '@analys/table'
import { TableCollection }                                     from '@foba/table'
import { decoTable, logger, says }                        from '@spare/logger'
import { isNumeric }                                           from '@typen/num-strict'
import { tableGroup }                                          from '../src/tableGroup'



const table = TableCollection.AeroEngineSpecs |> Table.from
table.map(x => isNumeric(x) ? +x : x, MUTABLE)

table|> decoTable|> logger

tableGroup.call(table, {
  key: { plant: x => x?.toLowerCase() },
  field: [
    ['maxt', MAX],
    ['maxt', MIN],
    ['maxt', FIRST],
    ['maxt', LAST],
    ['bypass', COUNT],
    ['dryw', AVERAGE],
    ['sku', ACCUM],
    ['app', MERGE],
  ],
  alias: [
    ['maxt', 'max'],
    ['maxt', 'min'],
    ['maxt', 'first'],
    ['maxt', 'last'],
  ]
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


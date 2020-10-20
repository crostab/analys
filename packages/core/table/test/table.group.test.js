import { MUTABLE }                            from '@analys/enum-mutabilities'
import { ACCUM, AVERAGE, MERGE }              from '@analys/enum-pivot-mode'
import { TableCollection }                    from '@foba/table'
import { decoTable, DecoTable, logger, says } from '@spare/logger'
import { isNumeric }                          from '@typen/num-strict'
import { Table }                              from '../src/Table'

const table = TableCollection.AeroEngineSpecs |> Table.from
table.map(x => isNumeric(x) ? +x : x, MUTABLE)
table |> DecoTable({ top: 2, bottom: 1 }) |> logger

table.group({ key: 'plant', field: 'sku' })
  |> decoTable
  |> says['plant to sku']

table.group({ key: { plant: x => x.toLowerCase() }, field: { app: MERGE, sku: ACCUM, maxt: AVERAGE } })
  |> decoTable
  |> says['plant to app']

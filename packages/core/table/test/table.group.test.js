import { ACCUM, INCRE, MERGE }                from '@analys/enum-pivot-mode'
import { TableCollection }                    from '@foba/table'
import { decoTable, DecoTable, logger, says } from '@spare/logger'
import { Table }                              from '../src/Table'

const table = TableCollection.AeroEngineSpecs |> Table.from

table |> DecoTable({ top: 2, bottom: 1 }) |> logger

table.group({ key: 'plant', field: 'sku' })
  |> decoTable
  |> says['plant to sku']

table.group({ key: { plant: x => x.toLowerCase() }, field: { app: MERGE, sku: ACCUM, maxt: INCRE } })
  |> decoTable
  |> says['plant to app']

import { MERGE }                   from '@analys/enum-pivot-mode'
import { TableCollection }         from '@foba/table'
import { deco }                    from '@spare/deco'
import { DecoTable, logger, says } from '@spare/logger'
import { Table }                   from '../src/Table'

const table = TableCollection.AeroEngineSpecs |> Table.from

table |> DecoTable({ top: 2, bottom: 1 }) |> logger

table.chips({ key: 'plant', field: 'sku', objectify: true })
  |> deco
  |> says['plant to sku']

table.chips({ key: 'plant', field: 'app', mode: MERGE, objectify: true })
  |> deco
  |> says['plant to app']

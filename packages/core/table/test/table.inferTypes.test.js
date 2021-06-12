import { Table }           from '@analys/table'
import { TableCollection } from '@foba/table'
import { delogger }        from '@spare/deco'
import { decoTable, says } from '@spare/logger'
import { NUMSTR }          from '@typen/enum-tabular-types'
import { InferType }       from '@typen/infer-type'
import { isNumeric }       from '@typen/num-strict'

let table = TableCollection.AeroEngineSpecs |> Table.from

table.unshiftRow(table.rows[0].map(() => undefined))

table |> decoTable |> says['original']

table.inferTypes({
  inferType: InferType({ isNumeric: isNumeric, numstr: NUMSTR }),
  omitNull: true
}) |> delogger

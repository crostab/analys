import { TableCollection } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { delogger } from '@spare/deco'
import { InferType } from '@typen/infer-type'
import { isNumeric } from '@typen/num-strict'
import { NUMSTR } from '@typen/enum-tabular-types'
import { Table } from '@analys/table'

let table = TableCollection.AeroEngineSpecs |> Table.from

table.unshiftRow(table.rows[0].map(() => undefined))

table |> decoTable |> says['original']

table.inferTypes({
  inferType: InferType({ isNumeric: isNumeric, numstr: NUMSTR }),
  omitNull: true
}) |> delogger

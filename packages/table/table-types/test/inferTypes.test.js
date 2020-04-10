import { TableCollection } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { delogger } from '@spare/deco'
import { InferType } from '@typen/infer-type'
import { isNumeric } from '@typen/num-strict'
import { NUMSTR } from '@typen/enum-tabular-types'
import { inferTypes } from '../src/indexes'

let table = TableCollection.AeroEngineSpecs
table.rows.push(table.rows[0].map(() => undefined))
table |> decoTable |> says['original']

inferTypes.call(table, { inferType: InferType({ isNumeric: isNumeric, numstr: NUMSTR }) }) |> delogger

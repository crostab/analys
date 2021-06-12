import { tableSelect }           from '@analys/table-select'
import { Foba }                  from '@foba/table'
import { deco, decoTable, says } from '@spare/logger'
import { Table }                 from '../src/Table'

const US_TECH = 'USTechFirms'
const table = Table.from(Foba[US_TECH])

table |> decoTable |> says.original

tableSelect(table, [ 'symbol', 'ceo', 'price' ], { mutate: true }) |> decoTable |> says.selected

table |> decoTable |> says.original

table.toSamples() |> deco |> says.samples


import { matchSlice }      from '@analys/table-init'
import { Foba }            from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableSelect }     from '../src/tableSelect'


const US_TECH = 'USTechFirms'
const table = Foba[US_TECH] |> matchSlice
table.rows = []

table |> decoTable |> says.original

// tableSelect(table, ['symbol', 'ceo', 'price'], { mutate: false }) |> decoT |> says.selected
tableSelect(table, [], { mutate: false }) |> decoTable |> says.selected

table |> decoTable |> says.original
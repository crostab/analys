import { Foba } from '@foba/table'
import { DecoTable, says } from '@spare/logger'
import { matchSlice } from '@analys/table-init'
import { tableSelect } from '../src/tableSelect'

const decoT = DecoTable({ top: 3, bottom: 2 })

const US_TECH = 'USTechFirms'
const table = Foba[US_TECH] |> matchSlice

table |> decoT |> says.original

// tableSelect(table, ['symbol', 'ceo', 'price'], { mutate: false }) |> decoT |> says.selected
tableSelect(table, [], { mutate: false }) |> decoT |> says.selected

table |> decoT |> says.original


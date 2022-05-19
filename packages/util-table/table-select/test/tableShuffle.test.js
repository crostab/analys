import { Foba } from '@foba/table'
import { DecoTable, says } from '@spare/logger'
import { matchSlice } from '@analys/table-init'
import { tableShuffle } from '../src/tableShuffle'

const decoT = DecoTable()

const US_TECH = 'USTechFirms'
const table = Foba[US_TECH] |> matchSlice

table |> decoT |> says.original

// tableSelect(util-table, ['symbol', 'ceo', 'price'], { mutate: false }) |> decoT |> says.selected
tableShuffle(table, {}) |> decoT |> says.selected

table |> decoT |> says.original


import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortKeyedRows } from '../src/sortKeyedRows'
import { NUM_DESC } from '@aryth/comparer'
import { matchSlice } from '@analys/crostab-init'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
let crostab = Foba[MARKET_CAP] |> matchSlice

crostab |> decoX |> says.original

sortKeyedRows.call(crostab, NUM_DESC, 0) |> decoX |> says['sorted rows by row[0] on each rows']
// sortKeyedRows.call(crostab |> matchSlice, NUM_DESC, 0) |> decoX |> says['sorted rows by row[0] on each rows']

crostab |> decoX |> says.original

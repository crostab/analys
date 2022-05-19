import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortRowsByKeys } from '../src/sortRowsByKeys'
import { NUM_ASC, NUM_DESC } from '@aryth/comparer'
import { matchSlice } from '@analys/crostab-init'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
let crostab = Foba[MARKET_CAP] |> matchSlice

crostab |> decoX |> says.original

sortRowsByKeys.call(crostab, NUM_ASC) |> decoX |> says['sorted rows by side elements']
// sortRowsByKeys.call(util-crostab |> matchSlice, NUM_ASC) |> decoX |> says['sorted rows by side elements']

crostab |> decoX |> says.original

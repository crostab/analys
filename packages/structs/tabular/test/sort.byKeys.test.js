import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortTabularByKeys } from '../src/sortTabularByKeys'
import { STR_DESC }          from '@aryth/comparer'
import { matchSlice as sliceCrostab } from '@analys/crostab-init'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
let crostab = Foba[MARKET_CAP] |> sliceCrostab

crostab |> decoX |> says.original

sortTabularByKeys.call(crostab, STR_DESC) |> decoX |> says['sorted columns by head elements']
// sortTabularByKeys.call(crostab |> sliceCrostab, NUM_DESC) |> decoX |> says['sorted columns by head elements']

crostab |> decoX |> says.original

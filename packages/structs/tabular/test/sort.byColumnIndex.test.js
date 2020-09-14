import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortTabular }       from '../src/sortTabular'
import { NUM_DESC }          from '@aryth/comparer'
import { matchSlice as sliceCrostab } from '@analys/crostab-init'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
let crostab = Foba[MARKET_CAP] |> sliceCrostab

crostab |> decoX |> says.original

sortTabular.call(crostab, NUM_DESC, 0) |> decoX |> says['sorted columns by column[0] on each columns']
// sortTabular.call(crostab |> sliceCrostab, NUM_DESC, 0) |> decoX |> says['sorted columns by column[0] on each columns']

crostab |> decoX |> says.original


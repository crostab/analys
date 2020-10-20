import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { selectKeyedRows } from '../src/selectKeyedRows'
import { matchSlice as sliceCrostab } from '@analys/crostab-init'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
const pickFields = ['2018', '2015', '2010', '2005', '2000']

let crostab = Foba[MARKET_CAP] |> sliceCrostab

crostab |> decoX |> says.original

selectKeyedRows.call(crostab, pickFields) |> decoX |> says.selected
// selectKeyedRows.call(crostab |> sliceCrostab, pickFields) |> decoX |> says.selected

crostab |> decoX |> says.original

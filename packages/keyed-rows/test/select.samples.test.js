import { Foba } from '@foba/crostab'
import { deco, DecoCrostab, says } from '@spare/logger'
import { matchSlice as sliceCrostab } from '@analys/crostab-init'
import { selectSamplesBySide } from '../src/selectSamplesBySide'

const decoX = DecoCrostab({ top: 5, bottom: 2 })

const MARKET_CAP = 'MarketCapListedDomestic'
const pickFields = ['2018', '2015', '2010', '2005', '2000']

let crostab = Foba[MARKET_CAP] |> sliceCrostab

crostab |> decoX |> says.original

selectSamplesBySide.call(crostab, pickFields) |> deco |> says.selected

crostab |> decoX |> says.original

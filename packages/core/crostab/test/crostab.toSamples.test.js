import { Foba } from '@foba/crostab'
import { deco, decoCrostab, says } from '@spare/logger'
import { CrosTab } from '../src/CrosTab'

const TITLE = 'ArmsExports'

let crostab = CrosTab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.rowwiseSamples(['CHN', 'IND', 'USA', 'EUU'], true) |> deco |> says[TITLE + ' rowwise-samples']

crostab.columnwiseSamples(['2018', '2013', '2008', '2003'], true) |> deco |> says[TITLE + ' columnwise-samples']

crostab |> decoCrostab |> says[TITLE + ' original']



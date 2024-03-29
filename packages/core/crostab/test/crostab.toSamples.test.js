import { Foba } from '@foba/crostab'
import { deco, decoCrostab, says } from '@spare/logger'
import { Crostab }                 from '../src/Crostab'

const TITLE = 'ArmsExports'

let crostab = Crostab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.rowwiseSamples(['CHN', 'IND', 'USA', 'EUU'], true) |> deco |> says[TITLE + ' rowwise-util-samples']

crostab.columnwiseSamples(['2018', '2013', '2008', '2003'], true) |> deco |> says[TITLE + ' columnwise-util-samples']

crostab |> decoCrostab |> says[TITLE + ' original']



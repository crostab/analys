import { Foba } from '@foba/crostab'
import { deco, decoCrostab, says } from '@spare/logger'
import { CrosTab } from '../src/CrosTab'

const TITLE = 'ArmsExports'

let crostab = CrosTab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.selectColumns(['CHN', 'IND', 'USA', 'EUU'], true) |> decoCrostab |> says[TITLE + ' select columns']

crostab |> decoCrostab |> says[TITLE + ' original']

crostab.selectRows(['2018', '2013', '2008', '2003'], true) |> decoCrostab |> says[TITLE + ' select rows']

crostab |> decoCrostab |> says[TITLE + ' original']



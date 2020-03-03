import { Foba } from '@foba/crostab'
import { decoCrostab, says } from '@spare/logger'
import { CrosTab } from '../src/CrosTab'
import { delogger } from '@spare/deco'

const TITLE = 'ArmsExports'

let crostab = CrosTab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.size |> says.size
crostab.ht |> says.ht
crostab.wd |> says.wd

const sideLabel = 2018 // '2018'
const headLabel = 'KOR'
crostab.roin(sideLabel) |> says['roin']
crostab.coin(headLabel) |> says['coin']
crostab.cell(sideLabel, headLabel) |> says['cell']
crostab.element(-1, -1) |> says['element']



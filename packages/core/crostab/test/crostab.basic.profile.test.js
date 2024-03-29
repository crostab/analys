import { Foba }                                 from '@foba/crostab'
import { decoCrostab, decoTable, logger, says } from '@spare/logger'
import { Crostab }                              from '../src/Crostab'

const TITLE = 'ArmsExports'

let crostab = Crostab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.size |> says.size
crostab.height |> says.height
crostab.width |> says.width

const sideLabel = 2018 // '2018'
const headLabel = 'KOR'
crostab.roin(sideLabel) |> says['roin']
crostab.coin(headLabel) |> says['coin']
crostab.cell(sideLabel, headLabel) |> says['cell']
crostab.element(-1, -1) |> says['element']

crostab.toTable('year') |> decoTable |> logger



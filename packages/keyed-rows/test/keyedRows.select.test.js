import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { selectKeyedRows } from '../src/selectKeyedRows'
import { selectSamplesBySide } from '../src/selectSamplesBySide'
import { delogger } from '@spare/deco'

let crostab = Foba.MarketCapListedDomestic
let { banner: head, side: side, matrix: rows } = crostab
crostab = { side, head, rows }

const pickFields = ['2018', '2015', '2010', '2005', '2000']

const decoX = DecoCrostab({ top: 5, bottom: 2 })
crostab |> decoX |> says.original;

({ rows, side } = selectKeyedRows.call(crostab, pickFields));
({ side, head, rows }) |> decoX |> says.selected

rows = selectSamplesBySide.call(crostab, pickFields)
rows|> delogger

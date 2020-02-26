import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortKeyedRows, sortRowsByKeys } from '../src/sortKeyedRows'
import { NUM_ASC, NUM_DESC } from '@aryth/comparer'
import { delogger } from '@spare/deco'

let crostab = Foba.MarketCapListedDomestic
let { banner: head, side: side, matrix: rows } = crostab
crostab = { side, head, rows }

const decoX = DecoCrostab({ top: 5, bottom: 2 })
crostab |> decoX |> says.original;

({ rows, side } = sortKeyedRows.call(crostab, NUM_DESC, 0));
({ side, head, rows }) |> decoX |> says.sorted;

({ rows, side } = sortRowsByKeys.call(crostab, NUM_DESC));
({ side, head, rows }) |> decoX |> says.sortedByKeys

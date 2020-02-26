import { Foba } from '@foba/crostab'
import { DecoCrostab, says } from '@spare/logger'
import { sortKeyedColumns, sortColumnsByKeys } from '../src/sortKeyedColumns'
import { NUM_DESC, STR_DESC } from '@aryth/comparer'

let crostab = Foba.MarketCapListedDomestic
let { side: side, banner: head, matrix: rows } = crostab
crostab = { head, side, rows }

const decoX = DecoCrostab({ top: 5, bottom: 2 })
crostab |> decoX |> says.original;

({ rows, head } = sortKeyedColumns.call(crostab, NUM_DESC, 0));
({ head, side, rows }) |> decoX |> says.sorted;

({ rows, head } = sortColumnsByKeys.call(crostab, STR_DESC));
({ head, side, rows }) |> decoX |> says.sortedByKeys

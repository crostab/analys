import { Foba } from '@foba/table'
import { decoCrostab, decoTable, deco, says } from '@spare/logger'
import { slice } from '@analys/table-init'
import { tablePivot } from '../src/tablePivot'
import { INCRE } from '@analys/enum-pivot-mode'
import { isNumeric } from '@typen/num-strict'

const ROSTER = 'BistroDutyRoster'
const table = Foba[ROSTER] |> slice
table |> decoTable |> says[ROSTER + ' original']

const spec = {
  side: 'day',
  banner: 'name',
  cell: { field: 'sold', mode: INCRE },
  filter: { field: 'sold', filter: isNumeric },
  formula: undefined,
}
spec |> deco |> says[ROSTER + ' tablespec']

tablePivot(table, spec) |> decoCrostab |> says[ROSTER + ' crostab']




import { COUNT }                              from '@analys/enum-pivot-mode'
import { slice }                              from '@analys/table-init'
import { Foba }                               from '@foba/table'
import { deco, decoCrostab, decoTable, says } from '@spare/logger'
import { isNumeric }                          from '@typen/num-strict'
import { tablePivot }                         from '../src/tablePivot'

const ROSTER = 'BistroDutyRoster'
const table = Foba[ROSTER] |> slice
table |> decoTable |> says[ROSTER + ' original']

const spec = {
  side: 'day',
  banner: 'name',
  field: { sold: COUNT },
  filter: { sold: isNumeric },
  formula: undefined,
}
spec |> deco |> says[ROSTER + ' tablespec']

tablePivot.call(spec, table) |> decoCrostab |> says[ROSTER + ' crostab']




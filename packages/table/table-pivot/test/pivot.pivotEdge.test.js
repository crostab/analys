import { Foba }                               from '@foba/table'
import { deco, decoCrostab, decoTable, says } from '@spare/logger'
import { slice }                              from '@analys/table-init'
import { pivotEdge }                          from '../src/pivotEdge'
import { COUNT }                              from '@analys/enum-pivot-mode'
import { isNumeric }                          from '@typen/num-strict'

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

pivotEdge(table, spec) |> decoCrostab |> says[ROSTER + ' crostab']




import { CrosTab }                   from '@analys/crostab'
import { INCRE }                     from '@analys/enum-pivot-mode'
import { TableCollection }           from '@foba/table'
import { decoCrostab, logger, says } from '@spare/logger'
import { strategies }                from '@valjoux/strategies'
import { Pivot }    from '../../src/Pivot'
import { PivotOri } from '../archive/PivotOri'

const duties = TableCollection.BistroDutyRoster
const pivotDev = new Pivot([0], [1], [2, INCRE], x => !isNaN(x))
const pivotOri = new PivotOri([0], [1], [2, INCRE], x => !isNaN(x))
const { lapse, result } = strategies({
  repeat: 1E+5,
  candidates: {
    simple: [duties.rows],
    again: [duties.rows],
  },
  methods: {
    bench: x => x,
    dev: rows => pivotDev.record(rows).toObject(),
    ori: rows => pivotOri.record(rows).toObject(),
    beta: x => x
  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

CrosTab.from(result).cell('simple', 'dev')|> decoCrostab |> logger
CrosTab.from(result).cell('simple', 'ori')|> decoCrostab |> logger

import { INCRE }             from '@analys/enum-pivot-mode'
import { TableCollection }   from '@foba/table'
import { decoCrostab, says } from '@spare/logger'
import { Pivot }             from '../src/Pivot'

const duties = TableCollection.BistroDutyRoster

const dutiesBeta = {
  head: ['day', 'name', 'served', 'sold', 'adt'],
  rows: [
    [3, 'Joyce', 100, 10, ''],
    [3, 'Lance', 100, 10, ''],
    [3, 'Naomi', 100, 10, ''],
  ]
}

let pivot = new Pivot({ key: 0 }, { key: 1 }, { key: 2, to: INCRE }) //  x => !isNaN(x)
pivot.record(duties.rows).toObject() |> decoCrostab |> says['spreadPivot']
pivot.record(dutiesBeta.rows).toObject() |> decoCrostab |> says['recordPivot']

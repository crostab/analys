import { ACCUM, COUNT, INCRE } from '@analys/enum-pivot-mode'
import { TableCollection }     from '@foba/table'
import { decoCrostab, says }   from '@spare/logger'
import { Cubic }               from '../src/Cubic'

const duties = TableCollection.BistroDutyRoster

const dutiesBeta = {
  head: ['day', 'name', 'served', 'sold', 'adt'],
  rows: [
    [3, 'Joyce', 100, 10, ''],
    [3, 'Lance', 100, 10, ''],
    [3, 'Naomi', 100, 10, ''],
  ]
}

let cubic = new Cubic(
  [{ key: 0, to: null }],
  [{ key: 1, to: null }],
  [
    { key: 2, to: INCRE },
    { key: 3, to: ACCUM },
    { key: 4, to: COUNT }
  ]
)

cubic.record(duties.rows).toObject() |> decoCrostab |> says['spreadCubic']
cubic.record(dutiesBeta.rows).toObject()  |> decoCrostab |> says['spreadCubic']

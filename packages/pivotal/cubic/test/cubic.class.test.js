import { ACCUM, COUNT, INCRE } from '@analys/enum-pivot-mode'
import { Cubic }               from '../src/Cubic'
import { decoCrostab, says }   from '@spare/logger'
import { TableCollection }     from '@foba/table'

const duties = TableCollection.BistroDutyRoster

const dutiesBeta = {
  head: ['day', 'name', 'served', 'sold', 'adt'],
  rows: [
    [3, 'Joyce', 100, 10, ''],
    [3, 'Lance', 100, 10, ''],
    [3, 'Naomi', 100, 10, ''],
  ]
}

const band = [
  [2, INCRE],
  [3, ACCUM],
  [4, COUNT]
]

let cubic = new Cubic(0, 1, band)

cubic.record(duties.rows).toObject() |> decoCrostab |> says['spreadCubic']
cubic.record(dutiesBeta.rows).toObject()  |> decoCrostab |> says['spreadCubic']

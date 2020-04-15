import { AVERAGE, INCRE, MAX, MIN }                             from '@analys/enum-pivot-mode'
import { Table }                                                from '@analys/table'
import { TableCollection }                                      from '@foba/table'
import { decoObject, decoSamples, decoTable, decoVector, says } from '@spare/logger'
import { Group }                                                from '../src/Group'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, { mutate: true })
table |> decoTable |> says['table']

const group = Group.build({
  key: [1, n => n.toLowerCase()],
  fields: [
    [2, INCRE],
    [3, AVERAGE],
    [3, MAX],
    [3, MIN]
  ]
})

group.record(table.rows).toRows() |> decoVector |> says['group rows']
group.record(table.rows).toObject() |> decoObject |> says['group object']
group.record(table.rows).toSamples() |> decoSamples |> says['group samples']

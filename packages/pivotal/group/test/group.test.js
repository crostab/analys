import { TableCollection }             from '@foba/table'
import { INCRE }                       from '@analys/enum-pivot-mode'
import { Table }                       from '@analys/table'
import { Group }                       from '../src/Group'
import { decoObject, decoTable, says } from '@spare/logger'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, { mutate: true })
table |> decoTable |> says['table']

const group = Group.build(1, [[2, INCRE], [3, INCRE]], () => {})

group.record(table.rows).toJson() |> decoObject |> says['group']

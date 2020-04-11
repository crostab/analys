import { TableCollection }             from '@foba/table'
import { INCRE }                       from '@analys/enum-pivot-mode'
import { Table }                       from '@analys/table'
import { Chips }                       from '../src/Chips'
import { decoObject, decoTable, says } from '@spare/logger'
import { MUTABLE }                     from '@analys/enum-mutabilities'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, MUTABLE)
table |> decoTable |> says['table']

const chip = Chips.build(1, 2, INCRE)

chip.record(table.rows).toObject() |> decoObject |> says['chips']

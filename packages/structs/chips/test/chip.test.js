import { MUTABLE }                     from '@analys/enum-mutabilities'
import { INCRE }                       from '@analys/enum-pivot-mode'
import { Table }                       from '@analys/table'
import { TableCollection }             from '@foba/table'
import { decoObject, decoTable, says } from '@spare/logger'
import { Chips }                       from '../src/Chips'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, MUTABLE)
table |> decoTable |> says['table']

const chip = Chips.build(1, 2, INCRE, x => x.toLowerCase())

chip.record(table.rows).toObject() |> decoObject |> says['chips']

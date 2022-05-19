import { Foba } from '@foba/table'
import { DecoTable, says } from '@spare/logger'
import { slice }           from '@analys/table-init'
import { tableDivide }     from '../src/tableDivide'
import { Table }           from '@analys/table/src/Table'

const decoTab = DecoTable({ top: 2, bottom: 1 })
const ROSTER = 'BistroDutyRoster'

let table = Foba[ROSTER] |> slice

table |> decoTab |> says[ROSTER + ' original']

const included = ['name']

let pick, rest
({ pick, rest } = tableDivide.call(Table.from(table).copy(), included))
pick |> decoTab |> says['pick from included']
rest |> decoTab |> says['rest from included']

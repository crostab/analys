import { MUTABLE }         from '@analys/enum-mutabilities'
import { INCRE }           from '@analys/enum-pivot-mode'
import { Table }           from '@analys/table'
import { TableCollection } from '@foba/table'
import { decoCrostab, decoTable, says } from '@spare/logger'
import { strategies }      from '@valjoux/strategies'
import { Chips }           from '../dist/index'
import { Chips }           from '../src/ChipsDev'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, MUTABLE)
table |> decoTable |> says['table']

const chipOri = Chips.build([1, x => x.toLowerCase()], [2, INCRE])
const chipDev = Chips.build([1, x => x.toLowerCase()], [2, INCRE])

const { lapse, result } = strategies({
  repeat: 1E+5,
  candidates: {
    simple: [table.rows],
  },
  methods: {
    bench: rows => {},
    ori: rows => chipOri.record(rows).toObject(),
    dev: rows => chipDev.record(rows).toObject(),
    beta: rows => rows.map(x => x),
  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']





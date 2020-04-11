import { Table }                                    from '@analys/table'
import { TableCollection }                          from '@foba/table'
import { decoSamples, decoTable, decoVector, says } from '@spare/logger'
import { Formula }                                  from '../src/Formula'

let table = TableCollection.BistroDutyRoster |> Table.from

table.map(x => Number.isNaN(x) ? 0 : x, { mutate: true })
table |> decoTable |> says['table']

const formula = Formula.build(
  [2, 3],
  [(served, sold) => (sold / served).toFixed(2)])

formula.calculate(table.rows).toRows() |> decoVector |> says['group rows']
formula.calculate(table.rows).toSamples() |> decoSamples |> says['group samples']

import { Table }                   from '@analys/table'
import { TableCollection }         from '@foba/table'
import { decoTable, logger, says } from '@spare/logger'
import { tableFormula }            from '../src/tableFormula'

const table = TableCollection.AeroEngineSpecs |> Table.from

table |> decoTable|> logger

tableFormula.call(table, {
  volume: (d, l) => (l / 100 * Math.PI * (d / 100 / 2) ** 2).toFixed(2),
  radius: d => d / 2
})
  |> decoTable
  |> says['formula']

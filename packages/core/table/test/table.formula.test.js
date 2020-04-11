import { TableCollection }                    from '@foba/table'
import { decoTable, DecoTable, logger, says } from '@spare/logger'
import { Table }                              from '../src/Table'

const table = TableCollection.AeroEngineSpecs |> Table.from

table |> DecoTable({ top: 2, bottom: 1 }) |> logger

table.formula({
  fields: ['d', 'l'],
  formulas: {
    volume: (d, l) => (l / 100 * Math.PI * (d / 100 / 2) ** 2).toFixed(2),
    radius: d => d / 2
  },
  append: true
})
  |> decoTable
  |> says['formula']

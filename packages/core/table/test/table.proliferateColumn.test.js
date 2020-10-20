import { decoTable, logger } from '@spare/logger'
import { Table }             from '../src/Table'

const table = Table.from({
  head: ['index', 'coordinate', 'status'],
  rows: [
    [0, [1, 2], 1],
    [1, [2, 3], 1],
    [2, [3, 4], 1],
    [3, [4, 5], 1],
  ]
})

table |> decoTable |> logger

table.proliferateColumn(
  // [
  { key: 'coordinate', to: ([x]) => x, as: 'x' },
  //   { key: 'coordinate', to: ([, y]) => y, as: 'y' }
  // ],
  { nextTo: 'coordinate' }
) |> decoTable|> logger



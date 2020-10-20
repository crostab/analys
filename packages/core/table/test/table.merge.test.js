import { decoTable, says } from '@spare/logger'
import { Table }           from '../src/Table'

const alpha = Table.from({
  head: ['a', 'b', 'c', 's'],
  rows: [
    [1, 2, 3, '-'],
    [1, 2, 3, '-'],
  ]
})

const beta = Table.from({
  head: ['b', 'c', 'd', 't'],
  rows: [
    [20, 30, 40, '--'],
    [20, 30, 40, '--'],
  ]
})

alpha.union(beta, { mutate: true }) |> decoTable |> says['union']
alpha |> decoTable |> says['alpha']
beta |> decoTable |> says['beta']

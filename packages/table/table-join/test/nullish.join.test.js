import { UNION }           from '@analys/enum-join-modes'
import { Table }           from '@analys/table'
import { decoTable, says } from '@spare/logger'
import { tableJoin }       from '../src/tableJoin'


function test() {
  const balance = Table.from({ head: [], rows: [] })
  const income = Table.from({
    head: ['symbol', 'rev', 'cost', 'inc', 'date'],
    rows: [
      ['AAPL', 600, 500, 100, '2024'],
      ['AAPL', 500, 420, 80, '2023'],
      ['AAPL', 400, 330, 70, '2022'],
      ['MSFT', 580, 490, 90, '2024'],
      ['MSFT', 480, 400, 80, '2023'],
      ['MSFT', 420, 350, 70, '2022'],
    ],
    title: 'income'
  })

  balance |> decoTable |> says['balance']
  income |> decoTable |> says['income']
  tableJoin(income, balance, ['date', 'symbol'], UNION) |> decoTable |> says['joined']

  '' |> console.log
  // 'Original balance table' |> console.log
  // balance |> TableX.brief |> console.log
}

test()


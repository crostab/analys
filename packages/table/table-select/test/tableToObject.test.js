import { Foba }            from '@foba/table'
import { deco }            from '@spare/deco'
import { decoTable, says } from '@spare/logger'
import { tableToObject }   from '../src/tableToObject'

const table = Foba['USTechFirms']

table |> decoTable |> says['original']

tableToObject.call(
  table,
  'symbol',
  [['symbol', 'code'], 'sector', ['price', 'stock_price']],
  true,
)
  |> deco
  |> says['tableToObject']

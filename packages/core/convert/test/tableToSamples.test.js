import { Foba }                         from '@foba/table'
import { decoSamples, decoTable, says } from '@spare/logger'
import { tableToSamples }               from '../src/tableToSamples'

const table = Foba['USTechFirms']

table |> decoTable |> says['original']

tableToSamples(table, [['symbol', 'code'], 'sector', ['price', 'stock_price']])
  |> decoSamples
  |> says['tableToSamples']

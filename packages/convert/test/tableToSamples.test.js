import { Foba } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableToSamples } from '../src/tableToSamples'
import { deco } from '@spare/deco'

const table = Foba['USTechFirms']

table |> decoTable |> says['original']

tableToSamples(table, [['symbol', 'code'], 'sector', ['price', 'stock_price']]) |> deco |> says['tableToSamples']

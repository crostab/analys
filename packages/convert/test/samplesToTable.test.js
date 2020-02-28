import { Foba } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableToSamples } from '../src/tableToSamples'
import { deco } from '@spare/deco'
import { samplesToTable } from '../src/samplesToTable'

const samples = tableToSamples(Foba['USTechFirms'])

samples |> deco |> says['original']

samplesToTable(samples, [['symbol', 'code'], 'industry', ['price', 'stock_price']]) |> decoTable |> says['samplesToTable']

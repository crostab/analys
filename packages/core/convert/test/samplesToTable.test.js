import { Foba }                         from '@foba/table'
import { decoSamples, decoTable, says } from '@spare/logger'
import { samplesToTable }               from '../src/samplesToTable'
import { tableToSamples }               from '../src/tableToSamples'

const samples = tableToSamples(Foba['USTechFirms'])

samples |> decoSamples |> says['original']

samplesToTable(samples, [['symbol', 'code'], 'industry', ['price', 'stock_price']]) |> decoTable |> says['samplesToTable']

import { tableToSamples }    from '@analys/convert'
import { Foba }              from '@foba/table'
import { deco }              from '@spare/deco'
import { decoSamples, says } from '@spare/logger'
import { Samples }           from '../src/samples'

const USFirms = 'USTechFirms'
const samples = Foba[USFirms] |> tableToSamples |> Samples.from

samples.data |> decoSamples |> says['original']

samples.select([['symbol', 'code'], 'price', ['industry', 'minor'], ['sector', 'major']]).data |> decoSamples |> says['selected']

samples.data|> decoSamples |> says['original']

import { tableToSamples } from '@analys/convert'
import { Foba }           from '@foba/table'
import { decoSamples, says } from '@spare/logger'
import { samplesSelect }     from '../src/samplesSelect'

const USFirms = 'USTechFirms'
const samples = tableToSamples(Foba[USFirms])

samples |> decoSamples |> says['original']

samplesSelect(samples, [['symbol', 'code'], 'price', ['industry', 'minor'], ['sector', 'major']]) |> decoSamples |> says['selected']

samples |> decoSamples |> says['original']

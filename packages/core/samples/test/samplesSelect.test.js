import { Foba } from '@foba/table'
import { tableToSamples } from '@analys/convert'
import { deco } from '@spare/deco'
import { says } from '@spare/logger'
import { samplesSelect } from '../src/samplesSelect'

const USFirms = 'USTechFirms'
const samples = tableToSamples(Foba[USFirms])

samples |> deco |> says['original']

samplesSelect(samples, [['symbol', 'code'], 'price', ['industry', 'minor'], ['sector', 'major']]) |> deco |> says['selected']

samples |> deco |> says['original']

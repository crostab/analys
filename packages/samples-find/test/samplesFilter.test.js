import { Foba } from '@foba/table'
import { tableToSamples } from '@analys/convert'
import { samplesFind } from '../src/samplesFind'
import { deca, decoSamples, says } from '@spare/logger'
import { deco } from '@spare/deco'

const FIRMS = 'ChinaConceptFirms'
const samples = Foba[FIRMS] |> tableToSamples

samples |> deca({ al: 1024 }) |> says['original']

samplesFind
  .call(samples, { sector (x) { return x === 'Communication Services' } })
  |> decoSamples |>  says['filtered']

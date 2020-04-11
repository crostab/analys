import { tableToSamples }          from '@analys/convert'
import { Foba }                    from '@foba/table'
import { deca, decoSamples, says } from '@spare/logger'
import { samplesFind }             from '../src/samplesFind'

const FIRMS = 'ChinaConceptFirms'
const samples = Foba[FIRMS] |> tableToSamples

samples
  |> deca({ al: 1024 })
  |> says['original']

samplesFind.call(
  samples, {
    sector (x) { return x === 'Communication Services' }
  })
  |> decoSamples
  |> says['filtered']

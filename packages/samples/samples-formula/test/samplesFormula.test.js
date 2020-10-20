import { tableToSamples }                       from '@analys/convert'
import { TableCollection }                      from '@foba/table'
import { decoSamples, decoTable, logger, says } from '@spare/logger'
import { samplesFormula }                       from '../src/samplesFormula'

const samples = TableCollection.AeroEngineSpecs |> tableToSamples

samples|> decoTable|> logger

samplesFormula.call(samples, {
  volume: (d, l) => (l / 100 * Math.PI * (d / 100 / 2) ** 2).toFixed(2),
  radius: d => d / 2
})
  |> decoSamples
  |> says['formula']
'' |> logger

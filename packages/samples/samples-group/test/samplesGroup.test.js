import { tableToSamples }             from '@analys/convert'
import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { TableCollection }                      from '@foba/table'
import { decoSamples, decoTable, logger, says } from '@spare/logger'
import { samplesGroup }                         from '../src/samplesGroup'

const samples = TableCollection.AeroEngineSpecs |> tableToSamples

samples|> decoTable|> logger

samplesGroup.call(samples, {
  key: 'plant',
  field: {
    sku: ACCUM,
    app: MERGE,
    maxt: INCRE,
    bypass: COUNT,
  },
})
  |> decoSamples
  |> says['multiple category: plant -> sku']
'' |> logger

samplesGroup.call(samples, {
  key: 'country',
  field: {
    sku: COUNT
  },
})
  |> decoSamples
  |> says['multiple category: plant -> sku']
'' |> logger


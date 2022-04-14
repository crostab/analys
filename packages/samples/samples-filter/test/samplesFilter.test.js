import { Foba }           from '@foba/table'
import { tableToSamples } from '@analys/convert'
import { samplesFilter }  from '../src/samplesFilter'
import { deca, says } from '@spare/logger'
import { deco } from '@spare/deco'

const FIRMS = 'ChinaConceptFirms'
const samples = Foba[FIRMS] |> tableToSamples

samples |> deca({ al: 1024 }) |> says['original']

samplesFilter.call(samples, {
  field: 'sector',
  filter: x => x === 'Communication Services'
}) |> deco |>  says['filtered']

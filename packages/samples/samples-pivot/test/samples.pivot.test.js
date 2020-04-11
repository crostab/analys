import { tableToSamples }                 from '@analys/convert'
import { ACCUM, INCRE }                   from '@analys/enum-pivot-mode'
import { samplesFind }                    from '@analys/samples-find'
import { Foba }                           from '@foba/table'
import { decoCrostab, decoSamples, says } from '@spare/logger'
import { isNumeric }                      from '@typen/num-strict'
import { samplesPivot }                   from '../src/samplesPivot'

const ROSTER = 'BistroDutyRoster'
let samples = Foba[ROSTER] |> tableToSamples
samples = samplesFind.call(samples, { served: isNumeric })

samples
  |> decoSamples
  |> says['original']

samplesPivot.call(samples, {
  side: 'day',
  banner: 'name',
  field: { sold: INCRE, served: ACCUM },
  filter: { served: isNumeric }
})
  |> decoCrostab
  |>  says['pivoted']

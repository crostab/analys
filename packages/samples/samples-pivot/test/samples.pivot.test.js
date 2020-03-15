import { Foba } from '@foba/table'
import { tableToSamples } from '@analys/convert'
import { deca, says } from '@spare/logger'
import { deco } from '@spare/deco'
import { samplesPivot } from '../src/samplesPivot'
import { isNumeric } from '@typen/num-strict'
import { ACCUM, INCRE } from '@analys/enum-pivot-mode'
import { samplesFilter } from '@analys/samples-filter/src/samplesFilter'

const ROSTER = 'BistroDutyRoster'
let samples = Foba[ROSTER] |> tableToSamples
samples = samplesFilter.call(samples, { field: 'served', filter: isNumeric })

samples |> deca({ al: 1024 }) |> says['original']

samplesPivot(samples, {
  side: 'day',
  banner: 'name',
  cell: [
    { field: 'sold', mode: INCRE },
    { field: 'served', mode: ACCUM }
  ],
  filter: { field: 'served', filter: isNumeric }
})|> deco |>  says['pivoted']

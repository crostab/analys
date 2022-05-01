import { CrosTab }                                                           from '@analys/crostab'
import { decoCrostab, decoVector, says }                                     from '@spare/logger'
import { strategies }                                                        from '@valjoux/strategies'
import { readFileSync }                                                      from 'fs'
import { NaiveCsv }                                                          from 'naivecsv'
import { indexed }                                                           from '../../src/indexed'
import { parseCsvEdge, parseCsvFut, parseCsvIter, parseCsvMap, parseCsvReg } from '../candidates'

const SRC = './packages/interop/csv/test/asset'
const { lapse, result } = strategies({
  repeat: 1E+4,
  candidates: {
    twitter: [ readFileSync(SRC + '/pome/twitter.csv', 'utf-8') ],
    simple: [ readFileSync(SRC + '/csv/simple.csv', 'utf-8') ],
    // finSector: [readFileSync('./packages/naivecsv/test/assets/csv/industry_sw.csv', 'utf-8')],
  },
  methods: {
    bench: x => x,
    iter: parseCsvIter,
    edge: parseCsvEdge,
    fut: parseCsvFut,
    map: parseCsvMap,
    reg: parseCsvReg,
    gen: tx => [ ...indexed(tx) ],
    class: NaiveCsv.toRows
  }
})
lapse |> decoCrostab |> says['lapse']
// result |> decoCrostab |> says['result']
const resultCrosTab = CrosTab.from(result)
resultCrosTab.cell('simple', 'iter') |> decoVector |> says['iter']
resultCrosTab.cell('simple', 'edge') |> decoVector |> says['edge']
resultCrosTab.cell('simple', 'fut') |> decoVector |> says['fut']
resultCrosTab.cell('simple', 'map') |> decoVector |> says['map']
resultCrosTab.cell('simple', 'reg') |> decoVector |> says['reg']
resultCrosTab.cell('simple', 'gen') |> decoVector |> says['gen']

// resultCrosTab.cell('finSector', 'class') |> deco |> says['reg']

import { says }                   from '@spare/logger'
import { decoCrostab }            from '@spare/logger'
import { strategies }             from '@valjoux/strategies'
import { timeseriesDifferential } from '../../src/timeseriesDifferential'
import { TableCollection }        from '../assets/tableCollection'
import { differentialOri }        from './differentialOri/differentialOri'

const { lapse, result } = strategies({
  repeat: 1E+5,
  candidates: {
    simple: [TableCollection.continued]
  },
  methods: {
    bench: x => x,
    ori: table => differentialOri.call(table.copy(), { dateLabel: 'date', excluded: ['symbol'] }),
    dev: table => timeseriesDifferential.call(table.copy(), { dateLabel: 'date', fields: ['perf', 'quant'] }),
    edge: x => x,
  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

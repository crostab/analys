import { TableCollection } from '@foba/table'
import { decoCrostab, decoTable, logger, says } from '@spare/logger'
import { strategies }   from '@valjoux/strategies'
import { lookup }       from '../src/lookup'
import { lookupCached } from '../src/lookupCached'
import { lookupTable, } from '../src/lookupTable'

const table = TableCollection.AeroEngineSpecs

table |> decoTable |> logger

const dict = lookupTable.call(table, 'sku', 'maxtwa', true)

const { lapse, result } = strategies({
  repeat: 2E+6,
  candidates: {
    simple: ['WS-15', 'sku', 'maxtwa'],
    another: ['GEnx-1B64', 'sku', 'app'],
  },
  methods: {
    bench: (x, k, v) => ([x, k, v]),
    classic: (x, k, v) => lookup.call(table, x, k, v),
    cached: (x, k, v) => lookupCached.call(table, x, k, v),
    edge: (x, k, v) => dict[x],
  },
  showParams: false
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

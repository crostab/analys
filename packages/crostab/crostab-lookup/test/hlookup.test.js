import { TableCollection } from '@foba/table'
import { decoCrostab, logger, says } from '@spare/logger'
import { strategies } from '@valjoux/strategies'
import { CrosTab } from '@analys/crostab'
import { hlookupTable } from '../src/hlookupTable'
import { hlookup } from '../src/hlookup'
import { hlookupCached } from '../src/hlookupCached'
import { Table } from '@analys/table'
import { delogger } from '@spare/deco'

const table = TableCollection.AeroEngineSpecs |> Table.from
const side = table.column('sku')
const { rows, head } = table
const crostab = CrosTab.from({ side, head, rows }).transpose()

crostab |> decoCrostab |> logger

const dict = hlookupTable.call(crostab, 'sku', 'maxtwa')
dict |> delogger
const { lapse, result } = strategies({
  repeat: 2E+6,
  candidates: {
    simple: ['WS-15', 'sku', 'maxtwa'],
    another: ['GEnx-1B64', 'sku', 'app'],
  },
  methods: {
    bench: (x, k, v) => ([x, k, v]),
    classic: (x, k, v) => hlookup.call(crostab, x, k, v),
    fut: (x, k, v) => hlookupCached.call(crostab, x, k, v),
    byDict: (x, k, v) => dict[x],
  },
  showParams: false
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

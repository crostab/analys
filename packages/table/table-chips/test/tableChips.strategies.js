import { TableCollection } from '@foba/table'
import { decoCrostab, decoTable, logger, says } from '@spare/logger'
import { strategies } from '@valjoux/strategies'
import { tableChips } from '../src/tableChips'
import { ACCUM } from '@analys/enum-pivot-mode'
import { CrosTab } from '@analys/crostab'
import { delogger } from '@spare/deco'

const table = TableCollection.AeroEngineSpecs

table |> decoTable |> logger

const { lapse, result } = strategies({
  repeat: 2E+5,
  candidates: {
    simple: [table, 'plant', 'sku'],
    another: [table, 'country', 'sku'],
  },
  methods: {
    bench: (x, key, field) => '',
    asObject: (x, key, field) => tableChips.call(table, { key, field, mode: ACCUM, objectify: true }),
    asEntries: (x, key, field) => tableChips.call(table, { key, field, mode: ACCUM, objectify: false }),
    _: (x, key, field) => '',
  },
  showParams: false
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

CrosTab.from(result).cell('simple', 'asObject') |> delogger

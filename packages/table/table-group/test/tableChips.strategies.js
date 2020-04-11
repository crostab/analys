import { CrosTab }                              from '@analys/crostab'
import { ACCUM }                                from '@analys/enum-pivot-mode'
import { tableChips }                           from '@analys/table-chips'
import { TableCollection }                      from '@foba/table'
import { delogger }                             from '@spare/deco'
import { decoCrostab, decoTable, logger, says } from '@spare/logger'
import { strategies }                           from '@valjoux/strategies'
import { tableGroup }                           from '..'

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
    tableChipsObj: (x, key, field) => tableChips.call(table, { key, field, mode: ACCUM, objectify: true }),
    tableChipsEnt: (x, key, field) => tableChips.call(table, { key, field, mode: ACCUM, objectify: false }),
    tableGroup: (x, key, field) => tableGroup.call(table, { key, field }),
  },
  showParams: false
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

CrosTab.from(result).cell('simple', 'asObject') |> delogger

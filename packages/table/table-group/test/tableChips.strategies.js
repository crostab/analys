import { CrosTab }                              from '@analys/crostab'
import { ACCUM }                                from '@analys/enum-pivot-mode'
import { Table }                                from '@analys/table'
import { tableChips }                           from '@analys/table-chips'
import { TableCollection }                      from '@foba/table'
import { decoCrostab, decoTable, logger, says } from '@spare/logger'
import { strategies }                           from '@valjoux/strategies'
import { pair }                                 from '@vect/object-init'
import { tableGroup }                           from '../src/tableGroup'

const table = TableCollection.AeroEngineSpecs |> Table.from

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
    tableGroupMutate: (x, key, field) => {
      table.mutateColumn(key, x => x.toLowerCase())
      return tableGroup.call(table, { key, field: pair(field, ACCUM) })
    },
    tableGroupEasy: (x, key, field) => {
      return tableGroup.call(table, { key: pair(key, x => x.toLowerCase()), field: pair(field, ACCUM), })
    },
  },
  showParams: false
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

CrosTab.from(result).cell('simple', 'tableGroupMutate') |> decoTable |> logger
CrosTab.from(result).cell('simple', 'tableGroupEasy') |> decoTable |> logger

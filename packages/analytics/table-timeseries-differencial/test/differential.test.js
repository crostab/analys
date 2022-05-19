import { says }                   from '@spare/logger'
import { decoTable }              from '@spare/logger'
import { timeseriesDifferential } from '../src/timeseriesDifferential'
import { TableCollection }        from './assets/tableCollection'

for (const [key, table] of Object.entries(TableCollection)) {
  timeseriesDifferential.call(table, {
    dateLabel: 'date',
    fields: ['perf', 'quant', 'value']
  }) |> decoTable |> says[key]
}

// Table.from(util-table).deleteColumns([SYMBOL], { mutate: true })


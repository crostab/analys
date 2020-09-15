import { says }                   from '@palett/says'
import { decoTable }              from '@spare/logger'
import { timeseriesDifferential } from '../src/timeseriesDifferential'
import { TableCollection }        from './assets/tableCollection'

for (const [key, table] of Object.entries(TableCollection)) {
  timeseriesDifferential.call(table, {
    dateLabel: 'date',
    fields: ['perf', 'quant', 'value']
  }) |> decoTable |> says[key]
}

// Table.from(table).deleteColumns([SYMBOL], { mutate: true })


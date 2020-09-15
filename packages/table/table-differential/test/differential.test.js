import { DIFFERENCE, ROLLING } from '@analys/enum-difference-modes'
import { says }                from '@palett/says'
import { decoTable }           from '@spare/logger'
import { differential }        from '../src/differential'
import { TableCollection }     from './assets/tableCollection'

for (const [key, table] of Object.entries(TableCollection)) {
  differential.call(table, {
    mode: [DIFFERENCE, ROLLING],
    dateLabel: 'date',
    fields: ['perf', 'quant', 'value']
  }) |> decoTable |> says[key]
}

// Table.from(table).deleteColumns([SYMBOL], { mutate: true })


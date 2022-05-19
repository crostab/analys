import { Foba } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableFilter }     from '../src/tableFilter'
import { slice }           from '@analys/table-init'

const ROSTER = 'BistroDutyRoster'

let alpha = Foba[ROSTER] |> slice

alpha |> decoTable |> says[ROSTER + ' original']

tableFilter.call(alpha, { field: 'day', filter: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

alpha |> decoTable |> says[ROSTER + ' original']

const beta = Foba[ROSTER] |> slice

beta |> decoTable |> says[ROSTER + ' original']

tableFilter.call(beta |> slice, { field: 'day', filter: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

beta |> decoTable |> says[ROSTER + ' original']

import { Foba } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableLookup } from '../src/tableLookup'
import { slice } from '@analys/table-init'

const ROSTER = 'BistroDutyRoster'

let alpha = Foba[ROSTER] |> slice

alpha |> decoTable |> says[ROSTER + ' original']

tableLookup.call(alpha, { day: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

alpha |> decoTable |> says[ROSTER + ' original']

const beta = Foba[ROSTER] |> slice

beta |> decoTable |> says[ROSTER + ' original']

tableLookup.call(beta |> slice, { day: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

beta |> decoTable |> says[ROSTER + ' original']

import { TableCollection } from '@foba/table'
import { decoTable, says } from '@spare/logger'
import { tableFind }       from '../src/tableFind'
import { slice }           from '@analys/table-init'

const ROSTER = 'BistroDutyRoster'

let alpha = TableCollection.BistroDutyRoster |> slice

alpha |> decoTable |> says[ROSTER + ' original']

tableFind.call(alpha, { day: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

alpha |> decoTable |> says[ROSTER + ' original']

const beta = TableCollection[ROSTER] |> slice

beta |> decoTable |> says[ROSTER + ' original']

tableFind.call(beta |> slice, { day: n => n === 3 }) |> decoTable |> says[ROSTER + ' filtered']

beta |> decoTable |> says[ROSTER + ' original']

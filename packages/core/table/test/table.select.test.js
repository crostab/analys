import { Foba }                              from '@foba/table'
import { deco, DecoTable, decoVector, says } from '@spare/logger'
import { Table }                             from '../src/Table'

const decoT = DecoTable({ top: 3, bottom: 2 })

const US_TECH = 'USTechFirms'
const table = Table.from(Foba[US_TECH])

table |> decoT |> says.original

table.select([ 'symbol', 'ceo', 'price' ], { mutate: true }) |> decoT |> says.selected

table |> decoT |> says.original

table.toSamples() |> deco |> says.samples

table.column('ceo') |> decoVector |> says.column


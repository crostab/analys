import { Foba } from '@foba/table'
import { deco, decoTable, DecoTable, logger, says } from '@spare/logger'
import { Table } from '../src/Table'

const US_TECH = 'USTechFirms'
const table = Table.from(Foba[US_TECH])

table |> decoTable |> says.original

tableSelect(['symbol', 'ceo', 'price'], { mutate: true }) |> decoTable |> says.selected

table |> decoTable |> says.original

table.toSamples() |> deco |> says.samples


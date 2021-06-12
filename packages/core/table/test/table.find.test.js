import { Foba }                        from '@foba/table'
import { decoTable, decoVector, says } from '@spare/logger'
import { Table }                       from '../src/Table'

const US_TECH = 'USTechFirms'
const table = Table.from(Foba[US_TECH])

table |> decoTable |> says.original

// table.find(['symbol', 'ceo', 'price'], { mutate: true }) |> decoT |> says.selected
const filter = { industry: x => x === 'Online Media' }
table.find(filter, { mutate: true })
  |> decoTable |> says.original

table.column('ceo') |> decoVector |> says.column


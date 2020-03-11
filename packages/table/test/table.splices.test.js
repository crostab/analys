import { Foba } from '@foba/table'
import { decoSamples, DecoTable, says } from '@spare/logger'
import { Table } from '../src/Table'

const decoT = DecoTable({ top: 3, bottom: 2 })

const US_TECH = 'USTechFirms'
const table = Table.from(Foba[US_TECH])

table |> decoT |> says.original

table.spliceColumns(['companyName', 'price', 'mktCap'], { mutate: true }) |> decoT |> says.splice

table.toSamples() |> decoSamples |> says['original samples']


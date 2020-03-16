import { Foba } from '@foba/crostab-select'
import { DecoTable, logger, says } from '@spare/logger'
import { Table } from '../src/Table'

const tableOb = Foba.USTechFirms
const table = Table.build(tableOb)
const decoT = DecoTable({ top: 3, bottom: 2 })
table |> decoT |> says.original
'' |> logger
table.select(['symbol', 'ceo', 'price']) |> decoT |> says.selected


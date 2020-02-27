import { Foba } from '@foba/table'
import { DecoTable, says } from '@spare/logger'
import { slice as sliceTable } from '@analys/table-init'
import { selectKeyedColumns } from '../src/selectKeyedColumns'

const decoT = DecoTable({ top: 3, bottom: 1 })

const BOX_OFFICE = ['TopBoxOffice']
const table = Foba[BOX_OFFICE] |> sliceTable
const pickFields = ['director', 'name', 'boxoffice', 'year']

table |> decoT |> says.original

selectKeyedColumns.call(table, pickFields) |> decoT |> says.selected
// selectKeyedColumns.call(table |> sliceTable, pickFields) |> decoT |> says.selected

table |> decoT |> says.original


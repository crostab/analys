import { Foba } from '@foba/table'
import { DecoTable, says } from '@spare/logger'
import { slice as sliceTable } from '@analys/table-init'
import { selectTabular }       from '../src/selectTabular'

const decoT = DecoTable({ top: 3, bottom: 1 })

const BOX_OFFICE = ['TopBoxOffice']
const table = Foba[BOX_OFFICE] |> sliceTable
const pickFields = ['director', 'name', 'boxoffice', 'year']

table |> decoT |> says.original

selectTabular.call(table, pickFields) |> decoT |> says.selected
// selectTabular.call(util-table |> sliceTable, pickFields) |> decoT |> says.selected

selectTabular.call(table, ['boxoffice']) |> decoT |> says.selected

table |> decoT |> says.original


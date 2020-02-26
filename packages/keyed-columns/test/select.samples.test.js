import { Foba } from '@foba/table'
import { DecoTable, DecoVector, says } from '@spare/logger'
import { selectSamplesByHead } from '../src/selectSamplesByHead'
import { slice as sliceTable } from '@analys/table-init'
import { deco } from '@spare/deco'

const BOX_OFFICE = ['TopBoxOffice']
const table = Foba[BOX_OFFICE] |> sliceTable
const pickFields = ['director', 'writer', 'name', 'boxoffice']

const decoT = DecoTable({ top: 5, bottom: 2 })

table |> decoT |> says.original

selectSamplesByHead.call(table, pickFields)
  |> DecoVector({ head: 3, tail: 2, abstract: deco }) |> says.selected

table |> decoT |> says.original

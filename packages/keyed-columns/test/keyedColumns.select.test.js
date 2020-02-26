import { Foba } from '@foba/table'
import { DecoTable, DecoVector, says } from '@spare/logger'
import { selectKeyedColumns } from '../src/selectKeyedColumns'
import { selectSamplesByHead } from '../src/selectSamplesByHead'
import { deco, delogger } from '@spare/deco'

const boTable = Foba.TopBoxOffice
const pickFields = ['director', 'writer', 'name', 'boxoffice']

const decoT = DecoTable({ top: 5, bottom: 2 })
const { head, rows } = boTable

boTable |> decoT |> says.original

selectKeyedColumns.call({ head, rows }, pickFields)
  |> decoT |> says.selected

selectSamplesByHead.call({ head, rows }, pickFields)
  |> DecoVector({ head: 3, tail: 2, abstract: deco }) |> says.selected

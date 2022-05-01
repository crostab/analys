import { decoCrostab, decoTable, says } from '@spare/logger'
import { readCrostabCollection }        from '../src/crostab'
import { readTableCollection }          from '../src/table'

const SRC = './static/excel/dolce.xlsx'

const crostabCollection = readCrostabCollection(SRC)
for (let key in crostabCollection) {
  crostabCollection[key]  |> decoCrostab|> says[key]
}

const tableCollection = readTableCollection(SRC)
for (let key in tableCollection) {
  tableCollection[key]  |> decoTable |> says[key]
}

import { TableCollection } from '@foba/table'
import { delogger }        from '@spare/deco'
import xlsx                from 'xlsx'
import { tableToWorkbook } from '../src/tableToWorkbook'

const test = async () => {
  const table = TableCollection.flopShuffle()
  const workbook = tableToWorkbook(table)
  xlsx.writeFile(workbook, './static/excel/singleSheet.xlsx')
  'done' |> delogger
}

test()



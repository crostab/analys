import { CrostabCollection }                                      from '@foba/crostab'
import { TableCollection }                                        from '@foba/table'
import { delogger }                                               from '@spare/deco'
import xlsx                                                       from 'xlsx'
import { crostabCollectionToWorkbook, tableCollectionToWorkbook } from '../index'

const testTables = async () => {
  const tableCollection = Object.assign({},
    TableCollection.flopShuffle({ keyed: true }),
    TableCollection.flopShuffle({ keyed: true }),
    TableCollection.flopShuffle({ keyed: true })
  )
  const workbook = tableCollectionToWorkbook(tableCollection)
  xlsx.writeFile(workbook, './static/excel/tables.xlsx')
  'done' |> delogger
}

const testCrostabs = async () => {
  const tableCollection = Object.assign({},
    CrostabCollection.flopShuffle({ keyed: true }),
    CrostabCollection.flopShuffle({ keyed: true }),
    CrostabCollection.flopShuffle({ keyed: true })
  )
  const workbook = crostabCollectionToWorkbook(tableCollection)
  xlsx.writeFile(workbook, './static/excel/crostabs.xlsx')
  'done' |> delogger
}

testTables().then()
testCrostabs().then()



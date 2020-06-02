import { TableCollection }           from '@foba/table'
import { delogger }                  from '@spare/deco'
import xlsx                          from 'xlsx'
import { tableCollectionToWorkbook } from '../src/tableToWorkbook'

const test = async () => {
  const tableCollection = Object.assign({},
    TableCollection.flopShuffle({ keyed: true }),
    TableCollection.flopShuffle({ keyed: true }),
    TableCollection.flopShuffle({ keyed: true })
  )
  const workbook = tableCollectionToWorkbook(tableCollection)
  xlsx.writeFile(workbook, './static/excel/some.xlsx')
  'done' |> delogger
}

test()



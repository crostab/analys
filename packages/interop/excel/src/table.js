import { tableToMatrix }                        from '@analys/convert'
import { csvToTable }                           from '@analys/csv'
import { utils as XL }                          from 'xlsx'
import { collectionToWorkbook, readCollection } from './collection'

const TABLE = 'table'

export const readTableCollection = (filename) => {
  return readCollection(filename, csvToTable)
}

export const tableToWorksheet = (table) => {
  const matrix = tableToMatrix(table)
  return XL.aoa_to_sheet(matrix)
}

export const tableToWorkbook = (table, sheetName) => {
  const workbook = XL.book_new()
  const worksheet = tableToWorksheet(table)
  const name = sheetName ?? table.title ?? TABLE
  XL.book_append_sheet(workbook, worksheet, name)
  return workbook
}

export const tableCollectionToWorkbook = (tableCollection) => {
  return collectionToWorkbook(tableCollection, tableToWorksheet)
}
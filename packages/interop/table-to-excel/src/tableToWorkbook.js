import { utils }            from 'xlsx'
import { tableToWorksheet } from './tableToWorksheet'

export const tableToWorkbook = (table, sheetName) => {
  const workbook = utils.book_new()
  utils.book_append_sheet(
    workbook,
    tableToWorksheet(table),
    sheetName ?? table.name ?? 'Sheet1'
  )
  return workbook
}

export const tableCollectionToWorkbook = (tableCollection) => {
  const workbook = utils.book_new()
  for (const [name, table] of Object.entries(tableCollection)) {
    utils.book_append_sheet(workbook, tableToWorksheet(table), name)
  }
  return workbook
}

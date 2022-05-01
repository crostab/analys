import { crostabToMatrix }                      from '@analys/convert'
import { csvToCrostab }                         from '@analys/csv'
import { utils as XL }                          from 'xlsx'
import { collectionToWorkbook, readCollection } from './collection'

export const CROSTAB = 'crostab'

export const readCrostabCollection = (filename) => {
  return readCollection(filename, csvToCrostab)
}

export const crostabToWorksheet = (table) => {
  const matrix = table|> crostabToMatrix
  return XL.aoa_to_sheet(matrix)
}

export const crostabToWorkbook = (crostab, sheetName) => {
  const workbook = XL.book_new()
  const worksheet = crostabToWorksheet(crostab)
  const name = sheetName ?? crostab.title ?? CROSTAB
  XL.book_append_sheet(workbook, worksheet, name)
  return workbook
}

export const crostabCollectionToWorkbook = (crostabCollection) => {
  return collectionToWorkbook(crostabCollection, crostabToWorksheet)
}
import { indexed, mapValues }           from '@vect/object-mapper'
import { readFile, utils, utils as XL } from 'xlsx'

export const collectionToWorkbook = (collection, toWorksheet) => {
  const workbook = XL.book_new()
  for (let [ name, body ] of indexed(collection)) {
    XL.book_append_sheet(workbook, toWorksheet(body), name)
  }
  return workbook
}

export const readCollection = (filename, csvParser) => {
  const workbook = readFile(filename)
  return mapValues(workbook.Sheets, (sheet) => utils.sheet_to_csv(sheet) |> csvParser)
}
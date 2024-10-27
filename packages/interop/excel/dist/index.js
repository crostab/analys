import { crostabToMatrix, tableToMatrix } from '@analys/convert';
import { csvToCrostab, csvToTable } from '@analys/csv';
import { utils, readFile } from 'xlsx';
import { indexed, mapKeyVal } from '@vect/object-mapper';

const collectionToWorkbook = (collection, toWorksheet) => {
  const workbook = utils.book_new();
  for (let [ name, body ] of indexed(collection)) {
    utils.book_append_sheet(workbook, toWorksheet(body), name);
  }
  return workbook
};

const readCollection = (filename, csvParser) => {
  const workbook = readFile(filename);
  return mapKeyVal(workbook.Sheets, (name, sheet) => csvParser(utils.sheet_to_csv(sheet)))
};

const CROSTAB = 'crostab';

const readCrostabCollection = (filename) => {
  return readCollection(filename, csvToCrostab)
};

const crostabToWorksheet = (table) => {
  const matrix = crostabToMatrix(table);
  return utils.aoa_to_sheet(matrix)
};

const crostabToWorkbook = (crostab, sheetName) => {
  const workbook = utils.book_new();
  const worksheet = crostabToWorksheet(crostab);
  const name = sheetName ?? crostab.title ?? CROSTAB;
  utils.book_append_sheet(workbook, worksheet, name);
  return workbook
};

const crostabCollectionToWorkbook = (crostabCollection) => {
  return collectionToWorkbook(crostabCollection, crostabToWorksheet)
};

const TABLE = 'table';

const readTableCollection = (filename) => {
  return readCollection(filename, csvToTable)
};

const tableToWorksheet = (table) => {
  const matrix = tableToMatrix(table);
  return utils.aoa_to_sheet(matrix)
};

const tableToWorkbook = (table, sheetName) => {
  const workbook = utils.book_new();
  const worksheet = tableToWorksheet(table);
  const name = sheetName ?? table.title ?? TABLE;
  utils.book_append_sheet(workbook, worksheet, name);
  return workbook
};

const tableCollectionToWorkbook = (tableCollection) => {
  return collectionToWorkbook(tableCollection, tableToWorksheet)
};

export { crostabCollectionToWorkbook, crostabToWorkbook, crostabToWorksheet, readCrostabCollection, readTableCollection, tableCollectionToWorkbook, tableToWorkbook, tableToWorksheet };

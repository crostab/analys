'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var convert = require('@analys/convert');
var csv = require('@analys/csv');
var xlsx = require('xlsx');
var objectMapper = require('@vect/object-mapper');

const collectionToWorkbook = (collection, toWorksheet) => {
  const workbook = xlsx.utils.book_new();

  for (let [name, body] of objectMapper.indexed(collection)) {
    xlsx.utils.book_append_sheet(workbook, toWorksheet(body), name);
  }

  return workbook;
};
const readCollection = (filename, csvParser) => {
  const workbook = xlsx.readFile(filename);
  return objectMapper.mapKeyValue(workbook.Sheets, (name, sheet) => {
    var _utils$sheet_to_csv;

    return _utils$sheet_to_csv = xlsx.utils.sheet_to_csv(sheet), csvParser(_utils$sheet_to_csv);
  });
};

const CROSTAB = 'crostab';
const readCrostabCollection = filename => {
  return readCollection(filename, csv.csvToCrostab);
};
const crostabToWorksheet = table => {
  var _table;

  const matrix = (_table = table, convert.crostabToMatrix(_table));
  return xlsx.utils.aoa_to_sheet(matrix);
};
const crostabToWorkbook = (crostab, sheetName) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = crostabToWorksheet(crostab);
  const name = sheetName ?? crostab.title ?? CROSTAB;
  xlsx.utils.book_append_sheet(workbook, worksheet, name);
  return workbook;
};
const crostabCollectionToWorkbook = crostabCollection => {
  return collectionToWorkbook(crostabCollection, crostabToWorksheet);
};

const TABLE = 'table';
const readTableCollection = filename => {
  return readCollection(filename, csv.csvToTable);
};
const tableToWorksheet = table => {
  var _table;

  const matrix = (_table = table, convert.tableToMatrix(_table));
  return xlsx.utils.aoa_to_sheet(matrix);
};
const tableToWorkbook = (table, sheetName) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = tableToWorksheet(table);
  const name = sheetName ?? table.title ?? TABLE;
  xlsx.utils.book_append_sheet(workbook, worksheet, name);
  return workbook;
};
const tableCollectionToWorkbook = tableCollection => {
  return collectionToWorkbook(tableCollection, tableToWorksheet);
};

exports.crostabCollectionToWorkbook = crostabCollectionToWorkbook;
exports.crostabToWorkbook = crostabToWorkbook;
exports.crostabToWorksheet = crostabToWorksheet;
exports.readCrostabCollection = readCrostabCollection;
exports.readTableCollection = readTableCollection;
exports.tableCollectionToWorkbook = tableCollectionToWorkbook;
exports.tableToWorkbook = tableToWorkbook;
exports.tableToWorksheet = tableToWorksheet;

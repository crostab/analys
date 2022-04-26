'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var xlsx = require('xlsx');

/**
 *
 * @type {Function|function(*):string}
 */
Function.prototype.call.bind(Object.prototype.toString);

/**
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */


const matchSlice = (o = {}) => {
  const head = o.head ?? o.banner,
        rows = o.rows ?? o.matrix;
  return {
    head,
    rows
  };
};

const R1C0 = {
  origin: {
    r: 1,
    c: 0
  }
};
const tableToWorksheet = table => {
  var _table;

  const {
    head,
    rows
  } = (_table = table, matchSlice(_table));
  const worksheet = xlsx.utils.aoa_to_sheet([head]);
  xlsx.utils.sheet_add_aoa(worksheet, rows, R1C0);
  return worksheet;
};

const tableToWorkbook = (table, sheetName) => {
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, tableToWorksheet(table), sheetName ?? table.name ?? 'Sheet1');
  return workbook;
};
const tableCollectionToWorkbook = tableCollection => {
  const workbook = xlsx.utils.book_new();

  for (const [name, table] of Object.entries(tableCollection)) {
    xlsx.utils.book_append_sheet(workbook, tableToWorksheet(table), name);
  }

  return workbook;
};

exports.tableCollectionToWorkbook = tableCollectionToWorkbook;
exports.tableToWorkbook = tableToWorkbook;
exports.tableToWorksheet = tableToWorksheet;

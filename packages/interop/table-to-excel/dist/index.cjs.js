'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var xlsx = require('xlsx');

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */


Array.prototype.take = function (len) {
  return this.slice(0, len);
};

Array.prototype.zip = function (another, zipper) {
  const {
    length
  } = this,
        arr = Array(length);

  for (let i = 0; i < length; i++) arr[i] = zipper(this[i], another[i], i);

  return arr; // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
};

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

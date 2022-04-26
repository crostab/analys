import { utils } from 'xlsx';

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
  const worksheet = utils.aoa_to_sheet([head]);
  utils.sheet_add_aoa(worksheet, rows, R1C0);
  return worksheet;
};

const tableToWorkbook = (table, sheetName) => {
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, tableToWorksheet(table), sheetName ?? table.name ?? 'Sheet1');
  return workbook;
};
const tableCollectionToWorkbook = tableCollection => {
  const workbook = utils.book_new();

  for (const [name, table] of Object.entries(tableCollection)) {
    utils.book_append_sheet(workbook, tableToWorksheet(table), name);
  }

  return workbook;
};

export { tableCollectionToWorkbook, tableToWorkbook, tableToWorksheet };

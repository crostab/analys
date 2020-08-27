import { utils } from 'xlsx';

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
 *
 * @param {Object} o
 * @returns {TableObject}
 */


const matchSlice = (o = {}) => {
  var _o$head, _o$rows;

  const head = (_o$head = o.head) !== null && _o$head !== void 0 ? _o$head : o.banner,
        rows = (_o$rows = o.rows) !== null && _o$rows !== void 0 ? _o$rows : o.matrix;
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
  var _ref;

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, tableToWorksheet(table), (_ref = sheetName !== null && sheetName !== void 0 ? sheetName : table.name) !== null && _ref !== void 0 ? _ref : 'Sheet1');
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

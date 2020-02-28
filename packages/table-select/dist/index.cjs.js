'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var keyedColumns = require('@analys/keyed-columns');
var tableInit = require('@analys/table-init');

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @param {boolean=true} [mutate]
 * @returns {TableObject}
 */

const tableSelect = function (table, fields, {
  mutate = false
} = {}) {
  var _table;

  let o = mutate ? table : (_table = table, tableInit.slice(_table));
  if (fields === null || fields === void 0 ? void 0 : fields.length) keyedColumns.selectKeyedColumns.call(o, fields);
  return o;
};

exports.tableSelect = tableSelect;

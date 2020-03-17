'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var keyedColumns = require('@analys/keyed-columns');
var tableInit = require('@analys/table-init');
var rand = require('@aryth/rand');
var vectorSelect = require('@vect/vector-select');

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

const MEAN = 5;
function tableShuffle(table, {
  h,
  w,
  oscillate
} = {}) {
  var _table;

  let {
    head,
    rows
  } = (_table = table, tableInit.matchSlice(_table));
  if (!h || oscillate) h = rand.randIntBetw(MEAN - 1, MEAN + 5);
  if (!w || oscillate) w = rand.randIntBetw(MEAN - 2, MEAN + 1);
  const headSelection = vectorSelect.shuffle(head.slice(), w);
  rows = vectorSelect.shuffle(rows.slice(), h);
  return keyedColumns.selectKeyedColumns.call({
    head,
    rows
  }, headSelection);
}

exports.tableSelect = tableSelect;
exports.tableShuffle = tableShuffle;

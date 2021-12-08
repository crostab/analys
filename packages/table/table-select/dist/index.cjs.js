'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tableInit = require('@analys/table-init');
var tabular = require('@analys/tabular');
var rand = require('@aryth/rand');
var vectorSelect = require('@vect/vector-select');
var tableIndex = require('@analys/table-index');
var nullish = require('@typen/nullish');
var columnGetter = require('@vect/column-getter');
var entriesInit = require('@vect/entries-init');
var objectInit = require('@vect/object-init');

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
  if (fields !== null && fields !== void 0 && fields.length) tabular.selectTabular.call(o, fields);
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
  if (!h || oscillate) h = rand.randBetw(MEAN - 1, MEAN + 5);
  if (!w || oscillate) w = rand.randBetw(MEAN - 2, MEAN + 1);
  const headSelection = vectorSelect.shuffle(head.slice(), w);
  rows = vectorSelect.shuffle(rows.slice(), h);
  return tabular.selectTabular.call({
    head,
    rows
  }, headSelection);
}

/**
 *
 * @param {string} key
 * @param {string|string[]|[string,string][]} [field]
 * @param objectify
 * @return {Object|Array}
 */

const tableToObject = function (key, field, objectify = true) {
  var _table$rows;

  const table = this;
  const hi = table === null || table === void 0 ? void 0 : (_table$rows = table.rows) === null || _table$rows === void 0 ? void 0 : _table$rows.length;
  let x, y;
  const keys = (x = tableIndex.coin.call(table, key)) >= 0 ? columnGetter.column(table.rows, x, hi) : null;
  const values = nullish.nullish(field) || Array.isArray(field) ? field !== null && field !== void 0 && field.length ? tabular.selectTabularToSamples.call(tableInit.matchSlice(table), field) : tabular.tabularToSamples.call(tableInit.matchSlice(table)) : (y = tableIndex.coin.call(table, field)) >= 0 ? columnGetter.column(table.rows, y, hi) : null;
  return keys && values ? objectify ? objectInit.wind(keys, values) : entriesInit.wind(keys, values) : objectify ? {} : [];
};

exports.tableSelect = tableSelect;
exports.tableShuffle = tableShuffle;
exports.tableToObject = tableToObject;

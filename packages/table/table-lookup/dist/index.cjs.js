'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumLookups = require('@analys/enum-lookups');
var tableIndex = require('@analys/table-index');
var columnGetter = require('@vect/column-getter');
var entriesInit = require('@vect/entries-init');
var objectInit = require('@vect/object-init');

const lookup = function (valueToFind, key, field) {
  const table = this,
        {
    head,
    rows
  } = table,
        x = head.indexOf(key),
        y = head.indexOf(field);
  if (x < 0 || y < 0) return null;
  const row = rows.find(row => row[x] === valueToFind);
  return row ? row[y] : null;
};
const lookupMany = function (valuesToFind, key, field) {
  const table = this,
        {
    head,
    rows
  } = table,
        x = head.indexOf(key),
        y = head.indexOf(field);
  if (x < 0 || y < 0) return valuesToFind.map(() => null);
  return valuesToFind.map(v => {
    const row = rows.find(row => row[x] === v);
    return row ? row[y] : null;
  });
};

const lookupTable = function (key, field, objectify) {
  const table = this,
        getColumn = columnGetter.Columns(table.rows);
  const [ki, vi] = [tableIndex.coin.call(table, key), tableIndex.coin.call(table, field)];
  return ki >= 0 && vi >= 0 ? objectify ? objectInit.wind(getColumn(ki), getColumn(vi)) : entriesInit.wind(getColumn(ki), getColumn(vi)) : objectify ? {} : [];
};

const lookupCached = function (valueToFind, key, field) {
  const table = this;
  let ds, dict;
  if (!(ds = table[enumLookups.VLKP]) || !(dict = ds.dict) || ds.key !== key || ds.value !== field) table[enumLookups.VLKP] = {
    dict: dict = lookupTable.call(table, key, field, true),
    key: key,
    value: field
  };
  return dict[valueToFind];
};

exports.lookup = lookup;
exports.lookupCached = lookupCached;
exports.lookupMany = lookupMany;
exports.lookupTable = lookupTable;

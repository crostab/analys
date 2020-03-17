'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumLookups = require('@analys/enum-lookups');
var tableIndex = require('@analys/table-index');
var columnGetter = require('@vect/column-getter');
var entriesInit = require('@vect/entries-init');
var objectInit = require('@vect/object-init');

const lookup = function (valueToFind, keyField, valueField) {
  const table = this,
        {
    head,
    rows
  } = table,
        ki = head.indexOf(keyField),
        vi = head.indexOf(valueField);
  if (ki < 0 || vi < 0) return null;
  const row = rows.find(row => row[ki] === valueToFind);
  return row ? row[vi] : null;
};
const lookupMany = function (valuesToFind, keyField, valueField) {
  const table = this,
        {
    head,
    rows
  } = table,
        ki = head.indexOf(keyField),
        vi = head.indexOf(valueField);
  if (ki < 0 || vi < 0) return valuesToFind.map(() => null);
  return valuesToFind.map(v => {
    const row = rows.find(row => row[ki] === v);
    return row ? row[vi] : null;
  });
};

const lookupTable = function (keyField, valueField, objectify = true) {
  const table = this,
        getColumn = columnGetter.Columns(table.rows);
  const [ki, vi] = [tableIndex.coin.call(table, keyField), tableIndex.coin.call(table, valueField)];
  return ki >= 0 && vi >= 0 ? objectify ? objectInit.wind(getColumn(ki), getColumn(vi)) : entriesInit.wind(getColumn(ki), getColumn(vi)) : objectify ? {} : [];
};

const lookupCached = function (valueToFind, keyField, valueField) {
  const table = this;
  let ds, dict;
  if (!(ds = table[enumLookups.VLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField) table[enumLookups.VLKP] = {
    dict: dict = lookupTable.call(table, keyField, valueField),
    key: keyField,
    value: valueField
  };
  return dict[valueToFind];
};

exports.lookup = lookup;
exports.lookupCached = lookupCached;
exports.lookupMany = lookupMany;
exports.lookupTable = lookupTable;

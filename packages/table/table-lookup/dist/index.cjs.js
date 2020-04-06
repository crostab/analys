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
        ki = head.indexOf(key),
        vi = head.indexOf(field);
  if (ki < 0 || vi < 0) return null;
  const row = rows.find(row => row[ki] === valueToFind);
  return row ? row[vi] : null;
};
const lookupMany = function (valuesToFind, key, field) {
  const table = this,
        {
    head,
    rows
  } = table,
        ki = head.indexOf(key),
        vi = head.indexOf(field);
  if (ki < 0 || vi < 0) return valuesToFind.map(() => null);
  return valuesToFind.map(v => {
    const row = rows.find(row => row[ki] === v);
    return row ? row[vi] : null;
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
  let dset, dict;
  if (!(dset = table[enumLookups.VLKP]) || !(dict = dset.dict) || dset.key !== key || dset.value !== field) table[enumLookups.VLKP] = {
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

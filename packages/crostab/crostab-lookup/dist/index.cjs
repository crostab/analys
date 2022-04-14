'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumLookups = require('@analys/enum-lookups');
var entriesInit = require('@vect/entries-init');
var objectInit = require('@vect/object-init');
var tableLookup = require('@analys/table-lookup');

const hlookup = function (valueToFind, keyField, valueField) {
  const crostab = this,
        {
    side,
    rows
  } = crostab;
  const y = (rows[side.indexOf(keyField)] || []).indexOf(valueToFind);
  const valueRow = rows[side.indexOf(valueField)] || [];
  return valueRow[y];
};
const hlookupMany = function (valuesToFind, keyField, valueField) {
  const crostab = this,
        {
    side,
    rows
  } = crostab;
  const krow = rows[side.indexOf(keyField)] || [];
  const vrow = rows[side.indexOf(valueField)] || [];
  return valuesToFind.map(v => vrow[krow.indexOf(v)]);
};

const hlookupTable = function (keyField, valueField, objectify = true) {
  const crostab = this,
        {
    side,
    rows
  } = crostab;
  const ki = side.indexOf(keyField),
        vi = side.indexOf(valueField);
  return ki >= 0 && vi >= 0 ? objectify ? objectInit.wind(rows[ki], rows[vi]) : entriesInit.wind(rows[ki], rows[vi]) : objectify ? {} : [];
};

const hlookupCached = function (valueToFind, keyField, valueField) {
  const crostab = this;
  let ds, dict;
  if (!(ds = crostab[enumLookups.HLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField) crostab[enumLookups.HLKP] = {
    dict: dict = hlookupTable.call(crostab, keyField, valueField),
    key: keyField,
    value: valueField
  };
  return dict[valueToFind];
};

Object.defineProperty(exports, 'vlookup', {
  enumerable: true,
  get: function () { return tableLookup.lookup; }
});
Object.defineProperty(exports, 'vlookupCached', {
  enumerable: true,
  get: function () { return tableLookup.lookupCached; }
});
Object.defineProperty(exports, 'vlookupMany', {
  enumerable: true,
  get: function () { return tableLookup.lookupMany; }
});
Object.defineProperty(exports, 'vlookupTable', {
  enumerable: true,
  get: function () { return tableLookup.lookupTable; }
});
exports.hlookup = hlookup;
exports.hlookupCached = hlookupCached;
exports.hlookupMany = hlookupMany;
exports.hlookupTable = hlookupTable;

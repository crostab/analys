import { HLKP } from '@analys/enum-lookups';
import { wind as wind$1 } from '@vect/entries-init';
import { wind } from '@vect/object-init';
export { lookup as vlookup, lookupCached as vlookupCached, lookupMany as vlookupMany, lookupTable as vlookupTable } from '@analys/table-lookup';

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
  return ki >= 0 && vi >= 0 ? objectify ? wind(rows[ki], rows[vi]) : wind$1(rows[ki], rows[vi]) : objectify ? {} : [];
};

const hlookupCached = function (valueToFind, keyField, valueField) {
  const crostab = this;
  let ds, dict;
  if (!(ds = crostab[HLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField) crostab[HLKP] = {
    dict: dict = hlookupTable.call(crostab, keyField, valueField),
    key: keyField,
    value: valueField
  };
  return dict[valueToFind];
};

export { hlookup, hlookupCached, hlookupMany, hlookupTable };

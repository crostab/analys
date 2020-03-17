import { VLKP } from '@analys/enum-lookups';
import { coin } from '@analys/table-index';
import { Columns } from '@vect/column-getter';
import { wind as wind$1 } from '@vect/entries-init';
import { wind } from '@vect/object-init';

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
        getColumn = Columns(table.rows);
  const [ki, vi] = [coin.call(table, keyField), coin.call(table, valueField)];
  return ki >= 0 && vi >= 0 ? objectify ? wind(getColumn(ki), getColumn(vi)) : wind$1(getColumn(ki), getColumn(vi)) : objectify ? {} : [];
};

const lookupCached = function (valueToFind, keyField, valueField) {
  const table = this;
  let ds, dict;
  if (!(ds = table[VLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField) table[VLKP] = {
    dict: dict = lookupTable.call(table, keyField, valueField),
    key: keyField,
    value: valueField
  };
  return dict[valueToFind];
};

export { lookup, lookupCached, lookupMany, lookupTable };

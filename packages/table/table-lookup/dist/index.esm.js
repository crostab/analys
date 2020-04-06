import { VLKP } from '@analys/enum-lookups';
import { coin } from '@analys/table-index';
import { Columns } from '@vect/column-getter';
import { wind as wind$1 } from '@vect/entries-init';
import { wind } from '@vect/object-init';

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
        getColumn = Columns(table.rows);
  const [ki, vi] = [coin.call(table, key), coin.call(table, field)];
  return ki >= 0 && vi >= 0 ? objectify ? wind(getColumn(ki), getColumn(vi)) : wind$1(getColumn(ki), getColumn(vi)) : objectify ? {} : [];
};

const lookupCached = function (valueToFind, key, field) {
  const table = this;
  let dset, dict;
  if (!(dset = table[VLKP]) || !(dict = dset.dict) || dset.key !== key || dset.value !== field) table[VLKP] = {
    dict: dict = lookupTable.call(table, key, field, true),
    key: key,
    value: field
  };
  return dict[valueToFind];
};

export { lookup, lookupCached, lookupMany, lookupTable };

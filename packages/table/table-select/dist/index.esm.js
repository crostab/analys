import { slice, matchSlice } from '@analys/table-init';
import { selectTabular, selectTabularToSamples, tabularToSamples } from '@analys/tabular';
import { randBetw } from '@aryth/rand';
import { shuffle } from '@vect/vector-select';
import { coin } from '@analys/table-index';
import { nullish } from '@typen/nullish';
import { column } from '@vect/column-getter';
import { wind as wind$1 } from '@vect/entries-init';
import { wind } from '@vect/object-init';

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

  let o = mutate ? table : (_table = table, slice(_table));
  if (fields !== null && fields !== void 0 && fields.length) selectTabular.call(o, fields);
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
  } = (_table = table, matchSlice(_table));
  if (!h || oscillate) h = randBetw(MEAN - 1, MEAN + 5);
  if (!w || oscillate) w = randBetw(MEAN - 2, MEAN + 1);
  const headSelection = shuffle(head.slice(), w);
  rows = shuffle(rows.slice(), h);
  return selectTabular.call({
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
  const keys = (x = coin.call(table, key)) >= 0 ? column(table.rows, x, hi) : null;
  const values = nullish(field) || Array.isArray(field) ? field !== null && field !== void 0 && field.length ? selectTabularToSamples.call(matchSlice(table), field) : tabularToSamples.call(matchSlice(table)) : (y = coin.call(table, field)) >= 0 ? column(table.rows, y, hi) : null;
  return keys && values ? objectify ? wind(keys, values) : wind$1(keys, values) : objectify ? {} : [];
};

export { tableSelect, tableShuffle, tableToObject };

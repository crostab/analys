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
 * @param {Filter[]|Filter} filterCollection
 * @return {Table} - mutated 'this' {head, rows}
 */
const tableFilter = function (filterCollection) {
  if (!Array.isArray(filterCollection)) return tableFilterOnce.call(this, filterCollection)
  for (let filterConfig of filterCollection) tableFilterOnce.call(this, filterConfig);
  return this
};

/**
 * @param {Filter} filterConfig
 * @return {Table} - mutated 'this' {head, rows}
 */
const tableFilterOnce = function ({ field, filter }) {
  let j = this.head.indexOf(field);
  if (j >= 0) this.rows = this.rows.filter(row => filter(row[j]));
  return this
};

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @param {boolean=true} [mutate]
 * @returns {TableObject}
 */
const tableSelect = function (table, fields, { mutate = false } = {}) {
  let o = mutate ? table : slice(table);
  if (fields?.length) selectTabular.call(o, fields);
  return o
};

const MEAN = 5;

function tableShuffle(table, { h, w, oscillate } = {}) {
  let { head, rows } = matchSlice(table);
  if (!h || oscillate) h = randBetw(MEAN - 1, MEAN + 5);
  if (!w || oscillate) w = randBetw(MEAN - 2, MEAN + 1);
  const headSelection = shuffle(head.slice(), w);
  rows = shuffle(rows.slice(), h);
  return selectTabular.call({ head, rows }, headSelection)
}

/**
 *
 * @param {string} key
 * @param {string|string[]|[string,string][]} [field]
 * @param objectify
 * @return {Object|Array}
 */
const tableToObject = function (key, field, objectify = true) {
  const table = this;
  const
    hi = table?.rows?.length;
  let x, y;
  const keys = ((x = coin.call(table, key)) >= 0) ? column(table.rows, x, hi) : null;
  const values = nullish(field) || Array.isArray(field)
    ? field?.length
      ? selectTabularToSamples.call(matchSlice(table), field)
      : tabularToSamples.call(matchSlice(table))
    : ((y = coin.call(table, field)) >= 0)
      ? column(table.rows, y, hi)
      : null;
  return keys && values
    ? objectify
      ? wind(keys, values)
      : wind$1(keys, values)
    : objectify
      ? {}
      : []
};

export { tableFilter, tableFilterOnce, tableSelect, tableShuffle, tableToObject };

import { selectKeyedColumns } from '@analys/keyed-columns';
import { slice, matchSlice } from '@analys/table-init';
import { randIntBetw } from '@aryth/rand';
import { shuffle } from '@vect/vector-select';

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
  if (fields === null || fields === void 0 ? void 0 : fields.length) selectKeyedColumns.call(o, fields);
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
  if (!h || oscillate) h = randIntBetw(MEAN - 1, MEAN + 5);
  if (!w || oscillate) w = randIntBetw(MEAN - 2, MEAN + 1);
  const headSelection = shuffle(head.slice(), w);
  rows = shuffle(rows.slice(), h);
  return selectKeyedColumns.call({
    head,
    rows
  }, headSelection);
}

export { tableSelect, tableShuffle };

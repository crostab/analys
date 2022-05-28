import { mapper, iterate } from '@vect/vector-mapper';
import { transpose } from '@vect/matrix-algebra';
import { unwind } from '@vect/entries-unwind';
import { select } from '@vect/vector-select';
import { toKeyComparer } from '@analys/util-keyed-vectors';
import { zipper } from '@vect/vector-zipper';
import { Columns } from '@vect/column-getter';

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        columns = transpose(rows),
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return mapper(columns, column => {
    let o = {};
    iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth);
    return o;
  });
};

/**
 * @param {(string|[*,*])[]} labels
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */

function selectKeyedRows(labels) {
  var _lookupIndexes$call;

  let indexes;
  [this.side, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), unwind(_lookupIndexes$call));
  this.rows = select(this.rows, indexes);
  return this;
}
/**
 *
 * @param {(string|[*,*])[]} labels
 * @returns {[string,number][]}
 */

function lookupIndexes(labels) {
  return mapper.call(this, labels, lookupIndex);
}
/**
 *
 * @param {string|[*,*]} [label]
 * @returns {[string,number]}
 */

function lookupIndex(label) {
  return Array.isArray(label) ? [label[1], this.side.indexOf(label[0])] : [label, this.side.indexOf(label)];
}

/**
 * @param {(str|[*,*])[]} labels
 * @return {Object[]} - 'this' remains unchanged
 */

const selectSamplesBySide = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes);
};

/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */

function sortRowsByKeys(comparer) {
  var _zipper$sort;

  let {
    side,
    rows
  } = this;
  [this.side, this.rows] = (_zipper$sort = zipper(side, rows, (key, row) => [key, row]).sort(toKeyComparer(comparer)), unwind(_zipper$sort));
  return this;
}

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */

const sortKeyedRows = function (comparer, index) {
  var _zipper$sort;

  if (index < 0) return sortRowsByKeys.call(this, comparer);
  let {
    side,
    rows
  } = this;
  /** Columns of [row[i]s, side, rows]  */

  const Cols = (_zipper$sort = zipper(side, rows, (key, row) => [row[index], key, row]).sort(toKeyComparer(comparer)), Columns(_zipper$sort));
  return this.side = Cols(1), this.rows = Cols(2), this;
};

export { selectKeyedRows, selectSamplesBySide, sortKeyedRows, sortRowsByKeys };

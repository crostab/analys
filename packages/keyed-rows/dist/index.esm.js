import { mapper, iterate } from '@vect/vector-mapper';
import { transpose } from '@vect/matrix-transpose';
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

const selectKeyedRows = function (labels) {
  var _lookupIndexes$call;

  let {
    rows
  } = this,
      side,
      indexes;
  [side, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), unwind(_lookupIndexes$call));
  rows = select(rows, indexes);
  return {
    side,
    rows
  };
};
/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */

const lookupIndexes = function (labels) {
  return mapper.call(this, labels, lookupIndex);
};
/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */

const lookupIndex = function (label) {
  const {
    side
  } = this;
  if (!Array.isArray(label)) return [label, side.indexOf(label)];
  let [current, projected] = label;
  return [projected, side.indexOf(current)];
};

const selectSamplesBySide = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes);
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{side:*[], rows:*[][]}}
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
  return {
    side: Cols(1),
    rows: Cols(2)
  };
};
/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */

const sortRowsByKeys = function (comparer) {
  var _zipper$sort2;

  let {
    side,
    rows
  } = this;
  [side, rows] = (_zipper$sort2 = zipper(side, rows, (key, row) => [key, row]).sort(toKeyComparer(comparer)), unwind(_zipper$sort2));
  return {
    side,
    rows
  };
};

export { selectKeyedRows, selectSamplesBySide, sortKeyedRows, sortRowsByKeys };

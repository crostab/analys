import { mapper, iterate } from '@vect/vector-mapper';
import { select } from '@vect/columns-select';
import { unwind } from '@vect/entries-unwind';
import { toKeyComparer } from '@analys/util-keyed-vectors';
import { zipper } from '@vect/vector-zipper';
import { Columns } from '@vect/column-getter';
import { transpose } from '@vect/matrix-transpose';

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return mapper(rows, row => {
    let o = {};
    iterate(fieldIndexPairs, ([field, index]) => o[field] = row[index], depth);
    return o;
  });
};

const selectKeyedColumns = function (labels) {
  var _lookupIndexes$call;

  let {
    rows
  } = this,
      head,
      indexes;
  [head, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), unwind(_lookupIndexes$call));
  rows = select(rows, indexes);
  return {
    head,
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
    head
  } = this;
  if (!Array.isArray(label)) return [label, head.indexOf(label)];
  let [current, projected] = label;
  return [projected, head.indexOf(current)];
};

const selectSamplesByHead = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes);
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{head:*[], rows:*[][]}}
 */

const sortKeyedColumns = function (comparer, index) {
  var _zipper$sort;

  if (index < 0) return sortColumnsByKeys.call(this, comparer);
  let {
    head,
    rows
  } = this,
      columns = transpose(rows);
  /** [column[i]s, head, columns]  */

  const Keyed = (_zipper$sort = zipper(head, columns, (key, column) => [column[index], key, column]).sort(toKeyComparer(comparer)), Columns(_zipper$sort));
  return {
    head: Keyed(1),
    rows: transpose(Keyed(2))
  };
};
/**
 *
 * @param comparer
 * @returns {{head:*[], rows:*[][]}}
 */

const sortColumnsByKeys = function (comparer) {
  var _zipper$sort2;

  let {
    head,
    rows
  } = this,
      columns = transpose(rows);
  [head, columns] = (_zipper$sort2 = zipper(head, columns, (key, row) => [key, row]).sort(toKeyComparer(comparer)), unwind(_zipper$sort2));
  rows = transpose(columns);
  return {
    head,
    rows
  };
};

export { selectKeyedColumns, selectSamplesByHead, sortColumnsByKeys, sortKeyedColumns };

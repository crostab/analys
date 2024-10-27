import { mapper, iterate } from '@vect/vector-mapper';
import { transpose } from '@vect/matrix-algebra';
import { unwind } from '@vect/entries-unwind';
import { select } from '@vect/vector-select';
import { toKeyComparer } from '@analys/util-keyed-vectors';
import { zipper } from '@vect/vector-zipper';
import { Columns } from '@vect/column-getter';

const selectSamples = function (fieldIndexPairs) {
  const { rows } = this, columns = transpose(rows), depth = fieldIndexPairs?.length;
  return mapper(columns, column => {
    let o = {};
    iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth);
    return o
  })
};

/**
 * @param {(string|[*,*])[]} labels
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */
function selectKeyedRows(labels) {
  let indexes;
  [ this.side, indexes ] = unwind(lookupIndexes.call(this, labels));
  this.rows = select(this.rows, indexes);
  return this
}


/**
 *
 * @param {(string|[*,*])[]} labels
 * @returns {[string,number][]}
 */
function lookupIndexes(labels) {
  return mapper.call(this, labels, lookupIndex)
}


/**
 *
 * @param {string|[*,*]} [label]
 * @returns {[string,number]}
 */
function lookupIndex(label) {
  return Array.isArray(label) ? [ label[1], this.side.indexOf(label[0]) ] : [ label, this.side.indexOf(label) ]
}

/**
 * @param {(str|[*,*])[]} labels
 * @return {Object[]} - 'this' remains unchanged
 */
const selectSamplesBySide = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes)
};

/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */
function sortRowsByKeys(comparer) {
  let { side, rows } = this;
  [ this.side, this.rows ] = unwind(zipper(side, rows,
    (key, row) => [ key, row ]
  ).sort(
    toKeyComparer(comparer)
  ));
  return this
}

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */
const sortKeyedRows = function (comparer, index) {
  if (index < 0) return sortRowsByKeys.call(this, comparer)
  let {side, rows} = this;
  /** Columns of [row[i]s, side, rows]  */
  const Cols = Columns(zipper(side, rows,
    (key, row) => [ row[index], key, row ]
  ).sort(
    toKeyComparer(comparer)
  ));
  return this.side = Cols(1), this.rows = Cols(2), this
};

export { selectKeyedRows, selectSamplesBySide, sortKeyedRows, sortRowsByKeys };

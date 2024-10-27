import { mapper, iterate } from '@vect/vector-mapper';
import { wind } from '@vect/object-init';
import { select } from '@vect/columns-select';
import { unwind } from '@vect/entries-unwind';
import { transpose } from '@vect/matrix-algebra';
import { zipper } from '@vect/vector-zipper';
import { toKeyComparer } from '@analys/util-keyed-vectors';
import { Columns } from '@vect/column-getter';

/**
 * @returns {Object[]} - 'this' remains unchanged
 */
const tabularToSamples = function () {
  const { head, rows } = this;
  return mapper(rows, row => wind(head, row))
};

/**
 * @param {(str|[*,*])[]} labels
 * @return {TableObject} - mutated 'this' {head, rows}
 */
const selectTabular = function (labels) {
  let { rows } = this, indexes;
  [this.head, indexes] = unwind(lookupIndexes.call(this, labels));
  this.rows = select(rows, indexes);
  return this
};

/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */
const lookupIndexes = function (labels) {
  return mapper.call(this, labels, lookupIndex)
};

/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */
const lookupIndex = function (label) {
  const { head } = this;
  if (!Array.isArray(label)) return [label, head.indexOf(label)]
  const [current, projected] = label;
  return [projected, head.indexOf(current)]
};

const selectSamples = function (fieldIndexPairs) {
  const { rows } = this, depth = fieldIndexPairs?.length;
  return mapper(rows, row => {
    let o = {};
    iterate(fieldIndexPairs, ([field, index]) => o[field] = row[index], depth);
    return o
  })
};

/**
 * @param labels
 * @returns {Object[]} - 'this' remains unchanged
 */
const selectTabularToSamples = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes)
};

/**
 *
 * @param comparer
 * @return {TableObject} - mutated 'this' {head, rows}
 */
const sortTabularByKeys$1 = function (comparer) {
  let { head, rows } = this, columns = transpose(rows);
  [this.head, columns] = unwind(zipper(head, columns,
    (key, row) => [ key, row ]
  ).sort(
    toKeyComparer(comparer)
  ));
  this.rows = transpose(columns);
  return this
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {TableObject} - mutated 'this' {head, rows}
 */
const sortTabular = function (comparer, index) {
  if (index < 0) return sortTabularByKeys.call(this, comparer)
  let { head, rows } = this, columns = transpose(rows);
  /** [column[i]s, head, columns]  */
  const Keyed = Columns(zipper(head, columns,
    (key, column) => [ column[index], key, column ]
  ).sort(
    toKeyComparer(comparer)
  ));
  return this.head = Keyed(1), this.rows = transpose(Keyed(2)), this
};

const voidTabular = () => ({ head: [], rows: [] });

export { selectTabular, selectTabularToSamples, sortTabular, sortTabularByKeys$1 as sortTabularByKeys, tabularToSamples, voidTabular };

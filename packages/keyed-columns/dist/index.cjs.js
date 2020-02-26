'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorMapper = require('@vect/vector-mapper');
var columnsSelect = require('@vect/columns-select');
var entriesUnwind = require('@vect/entries-unwind');
var utilKeyedVectors = require('@analys/util-keyed-vectors');
var vectorZipper = require('@vect/vector-zipper');
var columnGetter = require('@vect/column-getter');
var matrixTranspose = require('@vect/matrix-transpose');

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return vectorMapper.mapper(rows, row => {
    let o = {};
    vectorMapper.iterate(fieldIndexPairs, ([field, index]) => o[field] = row[index], depth);
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
  [head, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), entriesUnwind.unwind(_lookupIndexes$call));
  rows = columnsSelect.select(rows, indexes);
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
  return vectorMapper.mapper.call(this, labels, lookupIndex);
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
      columns = matrixTranspose.transpose(rows);
  /** [column[i]s, head, columns]  */

  const Keyed = (_zipper$sort = vectorZipper.zipper(head, columns, (key, column) => [column[index], key, column]).sort(utilKeyedVectors.toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
  return {
    head: Keyed(1),
    rows: matrixTranspose.transpose(Keyed(2))
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
      columns = matrixTranspose.transpose(rows);
  [head, columns] = (_zipper$sort2 = vectorZipper.zipper(head, columns, (key, row) => [key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), entriesUnwind.unwind(_zipper$sort2));
  rows = matrixTranspose.transpose(columns);
  return {
    head,
    rows
  };
};

exports.selectKeyedColumns = selectKeyedColumns;
exports.selectSamplesByHead = selectSamplesByHead;
exports.sortColumnsByKeys = sortColumnsByKeys;
exports.sortKeyedColumns = sortKeyedColumns;

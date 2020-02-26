'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorMapper = require('@vect/vector-mapper');
var matrixTranspose = require('@vect/matrix-transpose');
var entriesUnwind = require('@vect/entries-unwind');
var vectorSelect = require('@vect/vector-select');
var utilKeyedVectors = require('@analys/util-keyed-vectors');
var vectorZipper = require('@vect/vector-zipper');
var columnGetter = require('@vect/column-getter');

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        columns = matrixTranspose.transpose(rows),
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return vectorMapper.mapper(columns, column => {
    let o = {};
    vectorMapper.iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth);
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
  [side, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), entriesUnwind.unwind(_lookupIndexes$call));
  rows = vectorSelect.select(rows, indexes);
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
  return vectorMapper.mapper.call(this, labels, lookupIndex);
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

  const Cols = (_zipper$sort = vectorZipper.zipper(side, rows, (key, row) => [row[index], key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
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
  [side, rows] = (_zipper$sort2 = vectorZipper.zipper(side, rows, (key, row) => [key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), entriesUnwind.unwind(_zipper$sort2));
  return {
    side,
    rows
  };
};

exports.selectKeyedRows = selectKeyedRows;
exports.selectSamplesBySide = selectSamplesBySide;
exports.sortKeyedRows = sortKeyedRows;
exports.sortRowsByKeys = sortRowsByKeys;

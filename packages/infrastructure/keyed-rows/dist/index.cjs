'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorMapper = require('@vect/vector-mapper');
var matrixAlgebra = require('@vect/matrix-algebra');
var entriesUnwind = require('@vect/entries-unwind');
var vectorSelect = require('@vect/vector-select');
var utilKeyedVectors = require('@analys/util-keyed-vectors');
var vectorZipper = require('@vect/vector-zipper');
var columnGetter = require('@vect/column-getter');

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        columns = matrixAlgebra.transpose(rows),
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return vectorMapper.mapper(columns, column => {
    let o = {};
    vectorMapper.iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth);
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
  [this.side, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), entriesUnwind.unwind(_lookupIndexes$call));
  this.rows = vectorSelect.select(this.rows, indexes);
  return this;
}
/**
 *
 * @param {(string|[*,*])[]} labels
 * @returns {[string,number][]}
 */

function lookupIndexes(labels) {
  return vectorMapper.mapper.call(this, labels, lookupIndex);
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
  [this.side, this.rows] = (_zipper$sort = vectorZipper.zipper(side, rows, (key, row) => [key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), entriesUnwind.unwind(_zipper$sort));
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

  const Cols = (_zipper$sort = vectorZipper.zipper(side, rows, (key, row) => [row[index], key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
  return this.side = Cols(1), this.rows = Cols(2), this;
};

exports.selectKeyedRows = selectKeyedRows;
exports.selectSamplesBySide = selectSamplesBySide;
exports.sortKeyedRows = sortKeyedRows;
exports.sortRowsByKeys = sortRowsByKeys;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorMapper = require('@vect/vector-mapper');
var objectInit = require('@vect/object-init');
var columnsSelect = require('@vect/columns-select');
var entriesUnwind = require('@vect/entries-unwind');
var matrixTranspose = require('@vect/matrix-transpose');
var vectorZipper = require('@vect/vector-zipper');
var utilKeyedVectors = require('@analys/util-keyed-vectors');
var columnGetter = require('@vect/column-getter');

/**
 * @returns {Object[]} - 'this' remains unchanged
 */

const tabularToSamples = function () {
  const {
    head,
    rows
  } = this;
  return vectorMapper.mapper(rows, row => objectInit.wind(head, row));
};

/**
 * @param {(str|[*,*])[]} labels
 * @return {TableObject} - mutated 'this' {head, rows}
 */

const selectTabular = function (labels) {
  var _lookupIndexes$call;

  let {
    rows
  } = this,
      indexes;
  [this.head, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), entriesUnwind.unwind(_lookupIndexes$call));
  this.rows = columnsSelect.select(rows, indexes);
  return this;
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
  const [current, projected] = label;
  return [projected, head.indexOf(current)];
};

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

/**
 * @param labels
 * @returns {Object[]} - 'this' remains unchanged
 */

const selectTabularToSamples = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels);
  return selectSamples.call(this, fieldIndexes);
};

/**
 *
 * @param comparer
 * @return {TableObject} - mutated 'this' {head, rows}
 */

const sortTabularByKeys$1 = function (comparer) {
  var _zipper$sort;

  let {
    head,
    rows
  } = this,
      columns = matrixTranspose.transpose(rows);
  [this.head, columns] = (_zipper$sort = vectorZipper.zipper(head, columns, (key, row) => [key, row]).sort(utilKeyedVectors.toKeyComparer(comparer)), entriesUnwind.unwind(_zipper$sort));
  this.rows = matrixTranspose.transpose(columns);
  return this;
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {TableObject} - mutated 'this' {head, rows}
 */

const sortTabular = function (comparer, index) {
  var _zipper$sort;

  if (index < 0) return sortTabularByKeys.call(this, comparer);
  let {
    head,
    rows
  } = this,
      columns = matrixTranspose.transpose(rows);
  /** [column[i]s, head, columns]  */

  const Keyed = (_zipper$sort = vectorZipper.zipper(head, columns, (key, column) => [column[index], key, column]).sort(utilKeyedVectors.toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
  return this.head = Keyed(1), this.rows = matrixTranspose.transpose(Keyed(2)), this;
};

const voidTabular = () => ({
  head: [],
  rows: []
});

exports.selectTabular = selectTabular;
exports.selectTabularToSamples = selectTabularToSamples;
exports.sortTabular = sortTabular;
exports.sortTabularByKeys = sortTabularByKeys$1;
exports.tabularToSamples = tabularToSamples;
exports.voidTabular = voidTabular;

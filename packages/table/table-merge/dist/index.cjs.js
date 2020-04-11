'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mergeAcquire = require('@vect/merge-acquire');
var vectorZipper = require('@vect/vector-zipper');

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */

const tableAcquire = (ta, tb) => {
  mergeAcquire.acquire(ta.head, tb.head);
  vectorZipper.mutazip(ta.rows, tb.rows, (va, vb) => mergeAcquire.acquire(va, vb));
  return ta;
};
/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */

const tableMerge = (ta, tb) => {
  const head = mergeAcquire.merge(ta.head, tb.head);
  const rows = vectorZipper.zipper(ta.rows, tb.rows, (va, vb) => mergeAcquire.merge(va, vb));
  return ta.copy ? ta.copy({
    head,
    rows
  }) : {
    head,
    rows
  };
};

exports.tableAcquire = tableAcquire;
exports.tableMerge = tableMerge;

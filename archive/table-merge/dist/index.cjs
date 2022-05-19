'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorMerge = require('@vect/vector-algebra');
var vectorZipper = require('@vect/vector-zipper');

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */

const tableAcquire = (ta, tb) => {
  vectorMerge.acquire(ta.head, tb.head);
  vectorZipper.mutazip(ta.rows, tb.rows, (va, vb) => vectorMerge.acquire(va, vb));
  return ta;
};
/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */

const tableMerge = (ta, tb) => {
  const head = vectorMerge.merge(ta.head, tb.head);
  const rows = vectorZipper.zipper(ta.rows, tb.rows, (va, vb) => vectorMerge.merge(va, vb));
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

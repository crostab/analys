'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var veho = require('veho');

/** @typedef {{side:*[],head:*[],rows:*[][]}} CrostabObject */

/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */

const slice = ({
  side,
  head,
  rows
}) => ({
  side,
  head,
  rows
});
/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */

const shallow = ({
  side,
  head,
  rows
}) => ({
  side: side.slice(),
  head: head.slice(),
  rows: rows.map(row => row.slice())
});
/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */

const clone = ({
  side,
  head,
  rows
}) => ({
  side: side.slice(),
  head: head.slice(),
  rows: veho.Mx.clone(rows)
});

/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */

const matchSlice = o => {
  const side = o.side,
        head = o.head || o.banner,
        rows = o.rows || o.matrix;
  return {
    side,
    head,
    rows
  };
};
/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */

const matchShallow = o => {
  const side = o.side,
        head = o.head || o.banner,
        rows = o.rows || o.matrix;
  return {
    side: side.slice(),
    head: head.slice(),
    rows: rows.map(row => row.slice())
  };
};
/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */

const matchClone = o => {
  const side = o.side,
        head = o.head || o.banner,
        rows = o.rows || o.matrix;
  return {
    side: side.slice(),
    head: head.slice(),
    rows: veho.Mx.clone(rows)
  };
};

exports.clone = clone;
exports.matchClone = matchClone;
exports.matchShallow = matchShallow;
exports.matchSlice = matchSlice;
exports.shallow = shallow;
exports.slice = slice;

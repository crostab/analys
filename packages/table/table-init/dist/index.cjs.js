'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var veho = require('veho');

/** @typedef {{head:*[],rows:*[][]}} TableObject */

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */

const slice = ({
  head,
  rows
}) => ({
  head,
  rows
});
/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */

const shallow = ({
  head,
  rows
}) => ({
  head: head.slice(),
  rows: rows.map(row => row.slice())
});
/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */

const clone = ({
  head,
  rows
}) => ({
  head: head.slice(),
  rows: veho.Mx.clone(rows)
});

/**
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */

const matchSlice = (o = {}) => {
  const head = o.head ?? o.banner,
        rows = o.rows ?? o.matrix;
  return {
    head,
    rows
  };
};
/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */

const matchShallow = (o = {}) => {
  const head = o.head ?? o.banner,
        rows = o.rows ?? o.matrix;
  return {
    head: head.slice(),
    rows: rows.map(row => row.slice())
  };
};
/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */

const matchClone = (o = {}) => {
  const head = o.head ?? o.banner,
        rows = o.rows ?? o.matrix;
  return {
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

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
  var _o$head, _o$rows;

  const head = (_o$head = o.head) !== null && _o$head !== void 0 ? _o$head : o.banner,
        rows = (_o$rows = o.rows) !== null && _o$rows !== void 0 ? _o$rows : o.matrix;
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
  var _o$head2, _o$rows2;

  const head = (_o$head2 = o.head) !== null && _o$head2 !== void 0 ? _o$head2 : o.banner,
        rows = (_o$rows2 = o.rows) !== null && _o$rows2 !== void 0 ? _o$rows2 : o.matrix;
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
  var _o$head3, _o$rows3;

  const head = (_o$head3 = o.head) !== null && _o$head3 !== void 0 ? _o$head3 : o.banner,
        rows = (_o$rows3 = o.rows) !== null && _o$rows3 !== void 0 ? _o$rows3 : o.matrix;
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

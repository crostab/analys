'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var columnsSelect = require('@vect/columns-select');
var vectorSelect = require('@vect/vector-select');
var vectorMapper = require('@vect/vector-mapper');
var tableInit = require('@analys/table-init');

const NUM_ASC = (a, b) => a - b;

/**
 * Divide a table by fields
 * @param {*[]} fields
 * @return {{ pick:TableObject, rest:TableObject }} - mutated 'this' {head, rows}
 */

const tableDivide = function (fields) {
  var _this, _this2;

  /** @type {Table|TableObject} */
  const rs = (_this = this, tableInit.slice(_this));
  /** @type {Table|TableObject} */

  const pk = (_this2 = this, tableInit.slice(_this2));
  const {
    head,
    rows
  } = this;
  const indexes = vectorMapper.mapper(fields, label => head.indexOf(label)).sort(NUM_ASC);
  ({
    pick: pk.head,
    rest: rs.head
  } = vectorSelect.divide(head, indexes));
  ({
    pick: pk.rows,
    rest: rs.rows
  } = columnsSelect.divide(rows, indexes));
  return {
    pick: pk,
    rest: rs
  };
};

exports.tableDivide = tableDivide;

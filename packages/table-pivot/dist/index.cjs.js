'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pivot = require('@analys/pivot');
var cubic = require('@analys/cubic');
var crostab = require('@analys/crostab');
var tableInit = require('@analys/table-init');
var tableFilter = require('@analys/table-filter');
var vectorMapper = require('@vect/vector-mapper');
var tablespec = require('@analys/tablespec');
var tableFind = require('@analys/table-find');
var matrix = require('@vect/matrix');

/**
 *
 * @param {TableObject} table
 * @param {str} side
 * @param {str} banner
 * @param {CubeCell|CubeCell[]} [cell]
 * @param {Filter|Filter[]} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const pivotDev = (table, {
  side,
  banner,
  cell,
  filter,
  formula
}) => {
  if (filter) {
    var _table;

    table = tableFilter.tableFilter.call((_table = table, tableInit.slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let pivotter;
  const pivot$1 = Array.isArray(cell = tablespec.parseCell(cell, side)) ? (pivotter = true, cubic.Cubic.build(x, y, (vectorMapper.iterate(cell, appendIndex.bind(head)), cell))) : (pivotter = false, pivot.Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(rows).toJson());
  if (pivotter && formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

const appendIndex = function (cell) {
  cell.index = this.indexOf(cell.field);
};

/**
 *
 * @param {TableObject} table
 * @param {string|number} side
 * @param {string|number} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object|Object<str,function(*?):boolean>} [filter]
 * @param {function():number} [formula] - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const pivotEdge = (table, {
  side,
  banner,
  field,
  filter,
  formula
}) => {
  var _ref, _fieldSet, _pivot$configs;

  if (filter) {
    var _table;

    table = tableFind.tableFind.call((_table = table, tableInit.slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let cube, mode;
  const fieldSet = tablespec.parseFieldSet(field, side);
  _ref = (_fieldSet = fieldSet, deco(_fieldSet)), says['fieldSet'](_ref);
  const pivot$1 = matrix.isMatrix(fieldSet) ? (cube = true, cubic.Cubic.build(x, y, makeBand.call(head, fieldSet))) : (cube = false, [field, mode] = fieldSet, pivot.Pivot.build(x, y, head.indexOf(field), mode));
  _pivot$configs = pivot$1.configs, delogger(_pivot$configs);
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(rows).toJson());
  if (cube && formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

const makeBand = function (fieldSet) {
  const head = this;
  return vectorMapper.mapper(fieldSet, ([field, mode]) => ({
    index: head.indexOf(field),
    mode
  }));
};

exports.pivotDev = pivotDev;
exports.pivotEdge = pivotEdge;
exports.tablePivot = pivotEdge;

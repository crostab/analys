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
  const pivot$1 = Array.isArray(cell = tablespec.parseCell(cell, side)) ? (pivotter = true, cubic.Cubic.build(x, y, vectorMapper.mapper(cell, ({
    field,
    mode
  }) => [head.indexOf(field), mode]))) : (pivotter = false, pivot.Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(rows).toJson());
  if (pivotter && formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

/**
 *
 * @param {*} table
 * @param {string|number} side
 * @param {string|number} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object<string|number,function(*?):boolean>} [filter]
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
  if (filter) {
    table = tableFind.tableFind.call(tableInit.slice(table), filter);
  }

  const {
    head,
    rows
  } = table;
  let cubic$1;
  const crostabEngine = matrix.isMatrix(field = tablespec.parseField(field, side)) // fieldSet |> deco |> says['fieldSet']
  ? (cubic$1 = true, new cubic.Cubic(head.indexOf(side), head.indexOf(banner), field.map(([key, mode]) => [head.indexOf(key), mode]))) : (cubic$1 = false, new pivot.Pivot(head.indexOf(side), head.indexOf(banner), head.indexOf(field[0]), field[1]));
  const crostab$1 = crostab.CrosTab.from(crostabEngine.record(rows).toJson());
  if (cubic$1 && formula) crostab$1.map(vec => formula.apply(null, vec));
  return crostab$1;
};

exports.pivotDev = pivotDev;
exports.pivotEdge = pivotEdge;
exports.tablePivot = pivotEdge;

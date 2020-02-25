'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pivot = require('@analys/pivot');
var cubic = require('@analys/cubic');
require('@analys/table');
var crostab = require('@analys/crostab');
var enumPivotMode = require('@analys/enum-pivot-mode');

/**
 *
 * @param {Table} table
 * @param {str} s
 * @param {str} b
 * @param {CubeCell[]|CubeCell} [cell]
 * @param {Filter[]|Filter} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const tablePivot = (table, {
  side: s,
  banner: b,
  cell,
  filter,
  formula
}) => {
  // spec |> console.log
  table = table.filter(filter, {
    mutate: false
  });
  const [x, y] = [table.coin(s), table.coin(b)];
  if (!cell || !cell.length) cell = {
    field: s,
    mode: enumPivotMode.COUNT
  };
  let pivot$1 = Array.isArray(cell) ? cubic.Cubic.build(x, y, cell) : pivot.Pivot.build(x, y, cell.field, cell.mode);
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(table.rows));
  if (formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

exports.tablePivot = tablePivot;

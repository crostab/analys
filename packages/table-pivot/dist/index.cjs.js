'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pivot = require('@analys/pivot');
var cubic = require('@analys/cubic');
var crostab = require('@analys/crostab');
var tableInit = require('@analys/table-init');
var tableFilter = require('@analys/table-filter');
var vectorMapper = require('@vect/vector-mapper');
var enums = require('@typen/enums');
var enumPivotMode = require('@analys/enum-pivot-mode');

const parseCell = (cell, defaultField) => {
  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case enums.OBJ:
      if (Array.isArray(cell)) return cell.length ? vectorMapper.mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      if (!cell.field) cell.field = defaultField;
      if (!cell.mode) cell.mode = enumPivotMode.COUNT;
      return cell;

    case enums.STR:
    case enums.NUM:
      return {
        field: cell,
        mode: enumPivotMode.INCRE
      };

    default:
      return defaultCell(defaultField);
  }
};

const defaultCell = defaultField => ({
  field: defaultField,
  mode: enumPivotMode.COUNT
});

/**
 *
 * @param {TableObject} table
 * @param {str} side
 * @param {str} banner
 * @param {CubeCell[]|CubeCell} [cell]
 * @param {Filter[]|Filter} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const tablePivot = (table, {
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
        [x, y] = [head.indexOf(side), head.indexOf(banner)]; // table |> decoTable |> logger
  // cell |> deco |> logger
  // ({ x, y }) |> delogger

  let calc;
  const pivot$1 = Array.isArray(cell = parseCell(cell, side)) ? (calc = true, cubic.Cubic.build(x, y, (vectorMapper.iterate(cell, appendIndex.bind(head)), cell))) : (calc = false, pivot.Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(rows).toJson());
  if (calc && formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

const appendIndex = function (cell) {
  cell.index = this.indexOf(cell.field);
};

exports.tablePivot = tablePivot;

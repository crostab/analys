import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { slice } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import { iterate, mapper } from '@vect/vector-mapper';
import { parseCell, parseFieldSet } from '@analys/tablespec';
import { tableFind } from '@analys/table-find';
import { isMatrix } from '@vect/matrix';

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

    table = tableFilter.call((_table = table, slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let pivotter;
  const pivot = Array.isArray(cell = parseCell(cell, side)) ? (pivotter = true, Cubic.build(x, y, (iterate(cell, appendIndex.bind(head)), cell))) : (pivotter = false, Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (pivotter && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
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
  if (filter) {
    var _table;

    table = tableFind.call((_table = table, slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let cube, mode;
  const fieldSet = parseFieldSet(field, side); // fieldSet |> deco |> says['fieldSet']

  const pivot = isMatrix(fieldSet) ? (cube = true, Cubic.build(x, y, makeBand.call(head, fieldSet))) : (cube = false, [field, mode] = fieldSet, Pivot.build(x, y, head.indexOf(field), mode)); // pivot.configs |> delogger

  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (cube && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

const makeBand = function (fieldSet) {
  const head = this;
  return mapper(fieldSet, ([field, mode]) => ({
    index: head.indexOf(field),
    mode
  }));
};

export { pivotDev, pivotEdge, pivotEdge as tablePivot };

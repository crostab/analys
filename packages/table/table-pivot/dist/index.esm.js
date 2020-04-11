import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { slice } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import { mapper } from '@vect/vector-mapper';
import { parseCell, parseField } from '@analys/tablespec';
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
  const pivot = Array.isArray(cell = parseCell(cell, side)) ? (pivotter = true, Cubic.build(x, y, mapper(cell, ({
    field,
    mode
  }) => [head.indexOf(field), mode]))) : (pivotter = false, Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab = CrosTab.from(pivot.spread(rows).toObject());
  if (pivotter && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
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

const tablePivot = function ({
  side,
  banner,
  field,
  filter,
  formula
}) {
  const table = slice(this);

  if (filter) {
    tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;
  let cubic;
  const crostabEngine = isMatrix(field = parseField(field, side)) // fieldSet |> deco |> says['fieldSet']
  ? (cubic = true, new Cubic(head.indexOf(side), head.indexOf(banner), field.map(([key, mode]) => [head.indexOf(key), mode]))) : (cubic = false, new Pivot(head.indexOf(side), head.indexOf(banner), head.indexOf(field[0]), field[1]));
  const crostab = CrosTab.from(crostabEngine.record(rows).toObject());
  if (cubic && formula) crostab.map(vec => formula.apply(null, vec));
  return crostab;
};

export { pivotDev, tablePivot };

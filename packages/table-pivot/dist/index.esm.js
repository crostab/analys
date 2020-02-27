import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { slice } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import { mapper, iterate } from '@vect/vector-mapper';
import { NUM, STR, OBJ } from '@typen/enums';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';

const parseCell = (cell, defaultField) => {
  var _cell$field, _cell$mode;

  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case OBJ:
      if (Array.isArray(cell)) return cell.length ? mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      cell.field = (_cell$field = cell.field) !== null && _cell$field !== void 0 ? _cell$field : defaultField;
      cell.mode = (_cell$mode = cell.mode) !== null && _cell$mode !== void 0 ? _cell$mode : COUNT;
      return cell;

    case STR:
    case NUM:
      return {
        field: cell,
        mode: INCRE
      };

    default:
      return defaultCell(defaultField);
  }
};

const defaultCell = defaultField => ({
  field: defaultField,
  mode: COUNT
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

    table = tableFilter.call((_table = table, slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)]; // table |> decoTable |> logger
  // cell |> deco |> logger
  // ({ x, y }) |> delogger

  let calc;
  const pivot = Array.isArray(cell = parseCell(cell, side)) ? (calc = true, Cubic.build(x, y, (iterate(cell, appendIndex.bind(head)), cell))) : (calc = false, Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (calc && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

const appendIndex = function (cell) {
  cell.index = this.indexOf(cell.field);
};

export { tablePivot };

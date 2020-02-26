import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { slice } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';
import { iterate } from '@vect/vector-mapper';
import { NUM, STR, OBJ } from '@typen/enums';

const parseCell = (cell, defaultField) => {
  switch (typeof cell) {
    case OBJ:
      if (Array.isArray(cell)) return cell.length ? cell : {
        field: defaultField,
        mode: COUNT
      };
      if (!cell.field) cell.field = defaultField;
      if (!cell.mode) cell.mode = COUNT;
      return cell;

    case STR:
    case NUM:
      return {
        field: cell,
        mode: INCRE
      };

    default:
      return {
        field: defaultField,
        mode: COUNT
      };
  }
};
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
  cell = parseCell(cell, side);

  if (filter) {
    var _table;

    table = tableFilter.call((_table = table, slice(_table)), filter);
  } // table |> decoTable |> logger
  // table.rows |> decoMatrix |> logger
  // cell |> deco |> logger


  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)]; // ({ x, y }) |> delogger

  let calc, z;
  const pivot = Array.isArray(cell) ? (iterate(cell, c => c.index = head.indexOf(c.field)), calc = true, Cubic.build(x, y, cell)) : (z = head.indexOf(cell.field), calc = false, Pivot.build(x, y, z, cell.mode));
  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (calc && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

export { tablePivot };

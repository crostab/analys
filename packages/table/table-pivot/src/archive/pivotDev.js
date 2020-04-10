import { Pivot } from '@analys/pivot'
import { Cubic } from '@analys/cubic'
import { CrosTab } from '@analys/crostab'
import { slice } from '@analys/table-init'
import { tableFilter } from '@analys/table-filter'
import { mapper } from '@vect/vector-mapper'
import { parseCell } from '@analys/tablespec'

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
export const pivotDev = (
  table, {
    side,
    banner,
    cell,
    filter,
    formula
  }) => {
  if (filter) { table = tableFilter.call(table |> slice, filter) }
  const { head, rows } = table, [x, y] = [head.indexOf(side), head.indexOf(banner)]
  let pivotter
  const pivot = Array.isArray(cell = parseCell(cell, side))
    ? (pivotter = true, Cubic.build(x, y, mapper(cell, ({ field, mode }) => [head.indexOf(field), mode])))
    : (pivotter = false, Pivot.build(x, y, head.indexOf(cell.field), cell.mode))
  const crostab = CrosTab.from(pivot.spread(rows).toJson())
  if (pivotter && formula) crostab.map(ar => formula.apply(null, ar))
  return crostab
}

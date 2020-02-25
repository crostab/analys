import { Pivot } from '@analys/pivot'
import { Cubic } from '@analys/cubic'
import { Table } from '@analys/table'
import { CrosTab } from '@analys/crostab'
import { COUNT } from '@analys/enum-pivot-mode'

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
export const tablePivot = (table, {
  side: s,
  banner: b,
  cell,
  filter,
  formula
}) => {
  // spec |> console.log
  table = table.filter(filter, { mutate: false })
  const [x, y] = [table.coin(s), table.coin(b)]
  if (!cell || !cell.length) cell = { field: s, mode: COUNT }
  let pivot = Array.isArray(cell)
    ? Cubic.build(x, y, cell)
    : Pivot.build(x, y, cell.field, cell.mode)
  const crostab = CrosTab.from(pivot.spread(table.rows))
  if (formula) crostab.map(ar => formula.apply(null, ar))
  return crostab
}

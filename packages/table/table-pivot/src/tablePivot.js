import { Pivot }   from '@analys/pivot'
import { Cubic }   from '@analys/cubic'
import { CrosTab } from '@analys/crostab'
import { slice }      from '@analys/table-init'
import { tableFind }  from '@analys/table-find'
import { parseField } from '@analys/tablespec'
import { isMatrix }   from '@vect/matrix'

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
export const tablePivot = function ({
  side,
  banner,
  field,
  filter,
  formula
}) {
  const table = slice(this)
  if (filter) { tableFind.call(table, filter) }
  const { head, rows } = table
  let cubic
  const crostabEngine = isMatrix(field = parseField(field, side)) // fieldSet |> deco |> says['fieldSet']
    ? (cubic = true,
      new Cubic(head.indexOf(side), head.indexOf(banner), field.map(([key, mode]) => [head.indexOf(key), mode])))
    : (cubic = false,
      new Pivot(head.indexOf(side), head.indexOf(banner), head.indexOf(field[0]), field[1]))
  const crostab = CrosTab.from(crostabEngine.record(rows).toObject())
  if (cubic && formula) crostab.map(vec => formula.apply(null, vec))
  return crostab
}

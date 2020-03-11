import { Pivot } from '@analys/pivot'
import { Cubic } from '@analys/cubic'
import { CrosTab } from '@analys/crostab'
import { slice } from '@analys/table-init'
import { tableFind } from '@analys/table-find'
import { mapper } from '@vect/vector-mapper'
import { parseFieldSet } from '@analys/tablespec'
import { isMatrix } from '@vect/matrix'

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
export const pivotEdge = (
  table, {
    side,
    banner,
    field,
    filter,
    formula
  }) => {
  if (filter) {table = tableFind.call(table |> slice, filter)}
  const { head, rows } = table, [x, y] = [head.indexOf(side), head.indexOf(banner)]
  let cube, mode
  const fieldSet = parseFieldSet(field, side)
  fieldSet |> deco |> says['fieldSet']
  const pivot = isMatrix(fieldSet)
    ? (cube = true, Cubic.build(x, y, makeBand.call(head, fieldSet)))
    : (cube = false, ([field, mode] = fieldSet), Pivot.build(x, y, head.indexOf(field), mode))
  pivot.configs |> delogger
  const crostab = CrosTab.from(pivot.spread(rows).toJson())
  if (cube && formula) crostab.map(ar => formula.apply(null, ar))
  return crostab
}

const makeBand = function (fieldSet) {
  const head = this
  return mapper(fieldSet, ([field, mode]) => ({ index: head.indexOf(field), mode }))
}

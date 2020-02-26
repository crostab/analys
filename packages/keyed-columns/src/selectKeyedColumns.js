import { mapper } from '@vect/vector-mapper'
import { select as selectCols } from '@vect/columns-select'
import { unwind } from '@vect/entries-unwind'

export const selectKeyedColumns = function (labels) {
  let { rows } = this, head, indexes
  [head, indexes] = lookupIndexes.call(this, labels) |> unwind
  rows = selectCols(rows, indexes)
  return { head, rows }
}

/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */
export const lookupIndexes = function (labels) {
  return mapper.call(this, labels, lookupIndex)
}

/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */
export const lookupIndex = function (label) {
  const { head } = this
  if (!Array.isArray(label)) return [label, head.indexOf(label)]
  let [current, projected] = label
  return [projected, head.indexOf(current)]
}

import { mapper } from '@vect/vector-mapper'
import { select as selectCols } from '@vect/columns-select'
import { unwind } from '@vect/entries-unwind'

/**
 * @param {(str|[*,*])[]} labels
 * @return {TableObject} - mutated 'this' {head, rows}
 */
export const selectKeyedColumns = function (labels) {
  let { rows } = this, indexes;
  [this.head, indexes] = lookupIndexes.call(this, labels) |> unwind
  this.rows = selectCols(rows, indexes)
  return this
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

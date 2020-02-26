import { mapper } from '@vect/vector-mapper'
import { unwind } from '@vect/entries-unwind'
import { select as selectVecs } from '@vect/vector-select'

export const selectKeyedRows = function (labels) {
  let { rows } = this, side, indexes;
  [side, indexes] = lookupIndexes.call(this, labels) |> unwind
  rows = selectVecs(rows, indexes)
  return { side, rows }
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
  const { side } = this
  if (!Array.isArray(label)) return [label, side.indexOf(label)]
  let [current, projected] = label
  return [projected, side.indexOf(current)]
}

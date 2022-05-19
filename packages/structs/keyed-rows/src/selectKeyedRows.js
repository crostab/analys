import { mapper } from '@vect/vector-mapper'
import { unwind } from '@vect/entries-unwind'
import { select } from '@vect/vector-select'

/**
 * @param {(str|[*,*])[]} labels
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */
export const selectKeyedRows = function (labels) {
  let indexes;
  [ this.side, indexes ] = lookupIndexes.call(this, labels) |> unwind
  this.rows = select(this.rows, indexes)
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
  const { side } = this
  if (!Array.isArray(label)) return [ label, side.indexOf(label) ]
  let [ current, projected ] = label
  return [ projected, side.indexOf(current) ]
}

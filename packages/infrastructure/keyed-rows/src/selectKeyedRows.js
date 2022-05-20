import { mapper } from '@vect/vector-mapper'
import { unwind } from '@vect/entries-unwind'
import { select } from '@vect/vector-select'


/**
 * @param {(string|[*,*])[]} labels
 * @return {KeyedRows} - mutated 'this' {side, rows}
 */
export function selectKeyedRows(labels) {
  let indexes;
  [ this.side, indexes ] = lookupIndexes.call(this, labels) |> unwind
  this.rows = select(this.rows, indexes)
  return this
}


/**
 *
 * @param {(string|[*,*])[]} labels
 * @returns {[string,number][]}
 */
export function lookupIndexes(labels) {
  return mapper.call(this, labels, lookupIndex)
}


/**
 *
 * @param {string|[*,*]} [label]
 * @returns {[string,number]}
 */
export function lookupIndex(label) {
  return Array.isArray(label) ? [ label[1], this.side.indexOf(label[0]) ] : [ label, this.side.indexOf(label) ]
}

import { mapper } from '@vect/vector-mapper'
import { wind } from '@vect/object-init'

/**
 * @returns {Object[]} - 'this' remains unchanged
 */
export const tabularToSamples = function () {
  const { head, rows } = this
  return mapper(rows, row => wind(head, row))
}

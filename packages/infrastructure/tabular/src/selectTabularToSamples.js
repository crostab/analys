import { selectSamples } from '../utils/selectSamples'
import { lookupIndexes } from './selectTabular'

/**
 * @param labels
 * @returns {Object[]} - 'this' remains unchanged
 */
export const selectTabularToSamples = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels)
  return selectSamples.call(this, fieldIndexes)
}

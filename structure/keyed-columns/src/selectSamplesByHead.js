import { selectSamples } from '../utils/selectSamples'
import { lookupIndexes } from './selectKeyedColumns'

/**
 * @param labels
 * @returns {Object[]} - 'this' remains unchanged
 */
export const selectSamplesByHead = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels)
  return selectSamples.call(this, fieldIndexes)
}

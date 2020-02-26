import { selectSamples } from '../utils/selectSamples'
import { lookupIndexes } from './selectKeyedRows'

export const selectSamplesBySide = function (labels) {
  const fieldIndexes = lookupIndexes.call(this, labels)
  return selectSamples.call(this, fieldIndexes)
}

import { ACCUM, AVERAGE, COUNT, FIRST, INCRE, LAST, MAX, MIN }                 from '@analys/enum-pivot-mode'
import { CountGram, FirstGram, LastGram, ListGram, MaxGram, MinGram, SumGram } from './classes'

/** @typedef {{update,toObject}} IDataGram */

export class GramUtil {
  /**
   * @param {string} mode
   * @returns {DataGram|IDataGram}
   */
  static factory(mode) {
    if (mode === ACCUM || mode === AVERAGE) return ListGram.build()
    if (mode === COUNT) return CountGram.build()
    if (mode === INCRE) return SumGram.build()
    if (mode === MAX) return MaxGram.build()
    if (mode === MIN) return MinGram.build()
    if (mode === FIRST) return FirstGram.build()
    if (mode === LAST) return LastGram.build()
    return ListGram.build()
  }
}
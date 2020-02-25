import { accumSkeleton, increSkeleton } from '@analys/util-pivot'
import { ACCUM } from '@analys/enum-pivot-mode'
import { pivotSpread } from './pivotSpread'
import { pivotRecord } from './pivotRecord'

export class Pivot {
  constructor (x, y, z, mode, filter) {
    this.data = mode === ACCUM
      ? accumSkeleton()
      : increSkeleton()
    Object.assign(this, { x, y, z, mode, filter })
  }

  static build (x, y, z, mode, filter) { return new Pivot(x, y, z, mode, filter) }

  get configs () {
    const { x, y, z, mode, filter } = this
    return { x, y, z, mode, filter }
  }

  spread (samples) { return pivotSpread.call(this.data, samples, this.configs), this }
  record (samples) { return pivotRecord.call(this.data, samples, this.configs), this }

  toJson () {
    const { s, b, m } = this.data
    return { side: s, banner: b, matrix: m }
  }
}

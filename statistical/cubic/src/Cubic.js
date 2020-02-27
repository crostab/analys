import { cubicSkeleton } from '@analys/util-pivot'
import { cubicSpread } from './cubicSpread'
import { cubicRecord } from './cubicRecord'

export class Cubic {
  constructor (x, y, band, filter) {
    this.data = cubicSkeleton(band)
    Object.assign(this, { x, y, band, filter })
  }

  static build (x, y, band, filter) { return new Cubic(x, y, band, filter) }

  get configs () {
    const { x, y, band, filter } = this
    return { x, y, band, filter }
  }

  spread (samples) { return cubicSpread.call(this.data, samples, this.configs), this }
  record (samples) { return cubicRecord.call(this.data, samples, this.configs), this }

  toJson () {
    const { s, b, m } = this.data
    return { side: s, banner: b, matrix: m }
  }
}

import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { tallyAccum, tallyMerge }     from '@analys/util-pivot'
import { iterate }                    from '@vect/vector-mapper'

export class Chips {
  constructor (key, field, mode, filter) {
    this.key = key
    this.data = {}
    this.field = field
    this.updater = Updater(this.data, mode)
    this.filter = filter
  }

  static build (kei, field, mode) { return new Chips(kei, field, mode) }

  record (samples) { return iterate(samples, this.note.bind(this)), this }

  note (sample) { this.updater(sample[this.key], sample[this.field]) }

  toJson () { return this.data }
  toRows () { return Object.entries(this.data) }
}

export const Updater = (data, mode) => {
  if (mode === MERGE) return function (k, v) { if (k in this) { tallyMerge(this[k], v) } else { this[k] = v.slice() } }.bind(data)
  if (mode === ACCUM) return function (k, x) { if (k in this) { tallyAccum(this[k], x) } else { this[k] = [x] } }.bind(data)
  if (mode === INCRE) return function (k, n) { if (k in this) { this[k] += n } else { this[k] = n } }.bind(data)
  if (mode === COUNT) return function (k) { if (k in this) { this[k]++ } else { this[k] = 1 } }.bind(data)
  return () => {}
}

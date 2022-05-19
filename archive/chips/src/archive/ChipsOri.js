import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { parseKeyOnce } from '@analys/tablespec'
import { Accumulators } from 'archive/util-pivot'
import { wind }         from '@vect/object-init'
import { iterate }                    from '@vect/vector-mapper'

export class ChipsOri {
  /** @type {*} */ key
  /** @type {*} */ field
  /** @type {Object} */ data = {}
  /** @type {Function} */ pick
  /** @type {Function} */ updater
  /** @type {Function} */ filter
  constructor([key, pick], [field, mode], filter) {
    [this.key, this.pick] = parseKeyOnce(key)
    this.field = field
    this.updater = Updater(this.data, mode)
    this.filter = filter
  }

  static build([key, pick], [field, mode], filter) { return new ChipsOri([key, pick], [field, mode], filter) }

  record(samples) { return iterate(samples, this.note.bind(this)), this }

  note(sample) {
    let key = sample[this.key]
    if (this.pick) key = this.pick(key)
    this.updater(key, sample[this.field])
  }

  toObject() { return this.data }
  toRows() { return Object.entries(this.data) }
  toSamples() {
    const head = [this.key, this.field]
    return Object.entries(this.data).map(ent => wind(head, ent))
  }
}

const { merge, accum } = Accumulators

export const Updater = (data, mode) => {
  if (mode === MERGE) return function (k, v) {
    if (k in this) { merge(this[k], v) } else { this[k] = v.slice() }
  }.bind(data)
  if (mode === ACCUM) return function (k, x) {
    if (k in this) { accum(this[k], x) } else { this[k] = [x] }
  }.bind(data)
  if (mode === INCRE) return function (k, n) {
    if (k in this) { this[k] += n } else { this[k] = n }
  }.bind(data)
  if (mode === COUNT) return function (k) {
    if (k in this) { this[k]++ } else { this[k] = 1 }
  }.bind(data)
  return () => {}
}

import { modeToInit, modeToTally } from '@analys/util-pivot'
import { wind }                    from '@vect/object-init'
import { iterate }                 from '@vect/vector-mapper'

export class Chips {
  /** @type {*} */ key
  /** @type {*} */ field
  /** @type {Object} */ data = {}
  /** @type {Function} */ pick
  /** @type {Function} */ updater
  /** @type {Function} */ filter

  /**
   *
   * @param key
   * @param [pick]
   * @param field
   * @param mode
   * @param [filter]
   */
  constructor ([key, pick], [field, mode], filter) {
    this.key = key
    this.pick = pick
    this.field = field
    this.init = modeToInit(mode)
    this.tally = modeToTally(mode)
    this.filter = filter
  }

  static build ([key, pick], [field, mode], filter) { return new Chips([key, pick], [field, mode], filter) }

  record (samples) { return iterate(samples, this.note.bind(this)), this }

  note (sample) {
    const key = this.pick ? this.pick(sample[this.key]) : sample[this.key]
    const target = (key in this.data) ? this.data[key] : (this.data[key] = this.init())
    this.data[key] = this.tally(target, sample[this.field])
  }

  toObject () { return this.data }
  toRows () { return Object.entries(this.data) }
  toSamples () {
    const head = [this.key, this.field]
    return Object.entries(this.data).map(ent => wind(head, ent))
  }
}

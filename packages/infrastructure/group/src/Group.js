import { modeToInit, modeToTally } from '@analys/util-pivot'
import { acquire }                 from '@vect/vector-algebra'
import { pair, wind }              from '@vect/object-init'
import { iterate, mapper }         from '@vect/vector-mapper'
import { mutazip }                 from '@vect/vector-zipper'

export class Group {
  /** @type {*} */ key
  /** @type {Object} */ data = {}
  /** @type {Array} */ fields
  /** @type {Function} */ init
  /** @type {Function} */ to
  /** @type {Function} */ filter
  /** @type {Array} */ aliases

  /**
   *
   * @param key
   * @param [to]
   * @param fields
   * @param [filter]
   * @param [aliases]
   */
  constructor ([key, to], fields, filter, aliases) {
    this.key = key
    this.to = to
    this.fields = fields.map(([index, mode]) => [index, modeToTally(mode)])
    const
      inits = fields.map(([, mode]) => modeToInit(mode)),
      depth = inits.length
    this.init = () => mapper(inits, fn => fn(), depth)
    this.filter = filter
    this.aliases = aliases
  }

  static build (p) { return new Group(p.key, p.fields, p.filter, p.aliases) }
  get indexes () {return this.fields.map(([index]) => index)}

  record (samples) { return iterate(samples, this.note.bind(this)), this }

  note (sample) {
    const key = this.to ? this.to(sample[this.key]) : sample[this.key]
    mutazip(
      (key in this.data) ? this.data[key] : (this.data[key] = this.init()),
      this.fields,
      (target, [index, accum]) => accum(target, sample[index])
    )
  }

  toObject () { return this.data }
  toRows () { return Object.entries(this.data).map(([key, vec]) => acquire([key], vec)) }
  toSamples () {
    const { indexes } = this
    return Object.entries(this.data).map(([key, sample]) => Object.assign(pair(this.key, key), wind(indexes, sample)))
  }
}



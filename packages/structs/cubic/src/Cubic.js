import { ampliCell, modeToInit, modeToTally } from '@analys/util-pivot'
import { iterate }                            from '@vect/vector-mapper'
import { mutazip }                            from '@vect/vector-zipper'

export class Cubic {
  /** @type {Function} */ cell
  constructor ([x, xmap], [y, ymap], fields, filter) {
    this.x = x
    this.xm = xmap
    this.y = y
    this.ym = ymap
    this.fields = fields.map(([index, mode]) => [index, modeToTally(mode, filter)])
    const inits = fields.map(([, mode]) => modeToInit(mode))
    this.data = { s: [], b: [], m: [], n: () => inits.map(fn => fn()) }
  }

  static build (x, y, fields, filter) { return new Cubic(x, y, fields, filter) }

  record (samples) { return this.cell = ampliCell.bind(this.data), iterate(samples, this.note.bind(this)), this }

  note (sample) {
    const sk = this.xm ? this.xm(sample[this.x]) : sample[this.x]
    const bk = this.ym ? this.ym(sample[this.y]) : sample[this.y]
    mutazip(
      this.cell(sk, bk),
      this.fields,
      (target, [index, tally]) => tally(target, sample[index])
    )
  }

  toObject () {
    const { s, b, m } = this.data
    return { side: s, head: b, rows: m }
  }
}

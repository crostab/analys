import { ampliCell, modeToInit, modeToTally } from '@analys/util-pivot'
import { iterate }                            from '@vect/vector-mapper'
import { mutazip }                            from '@vect/vector-zipper'

export class NestCubic {
  /** @type {Function} */ cell
  constructor([x, xf], [y, yf], fields, filter) {
    this.x = x
    this.xf = xf
    this.y = y
    this.yf = yf
    this.fields = fields.map(([index, mode]) => [index, modeToTally(mode, filter)])
    const inits = fields.map(([, mode]) => modeToInit(mode))
    this.data = { s: [], b: [], m: [], n: () => inits.map(fn => fn()) }
  }

  static build(x, y, fields, filter) { return new Cubic(x, y, fields, filter) }

  record(samples) { return this.cell = ampliCell.bind(this.data), iterate(samples, this.note.bind(this)), this }

  note(sample) {
    const sk = this.xf ? this.xf(sample[this.x]) : sample[this.x]
    const bk = this.yf ? this.yf(sample[this.y]) : sample[this.y]
    mutazip(
      this.cell(sk, bk),
      this.fields,
      (target, [index, accum]) => accum(target, sample[index])
    )
  }

  toObject() {
    const { s, b, m } = this.data
    return { side: s, head: b, rows: m }
  }
}

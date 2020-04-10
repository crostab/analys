import { COUNT, INCRE }       from '@analys/enum-pivot-mode'
import { Accrual, ampliCell } from '@analys/util-pivot'
import { mutazip }            from '@vect/vector-zipper'
import { iterate }            from '@vect/vector-mapper'

export class Cubic {
  /** @type {Function} */ cell
  constructor (x, y, fields, filter) {
    this.x = x
    this.y = y
    this.fields = fields.map(([index, mode]) => [index, Accrual(mode, filter)])
    const inits = fields.map(([, mode]) => mode === INCRE || mode === COUNT ? () => 0 : () => [])
    this.data = { s: [], b: [], m: [], n: () => inits.map(fn => fn()) }
  }

  static build (x, y, fields, filter) { return new Cubic(x, y, fields, filter) }

  record (samples) { return this.cell = ampliCell.bind(this.data), iterate(samples, this.note.bind(this)), this }

  note (sample) {
    mutazip(
      this.cell(sample[this.x], sample[this.y]),
      this.fields,
      (target, [index, accrue]) => accrue(target, sample[index])
    )
  }

  toJson () {
    const { s, b, m } = this.data
    return { side: s, head: b, rows: m }
  }
}

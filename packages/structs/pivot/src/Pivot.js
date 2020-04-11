import { acid, ampliCell, arid, tallyIncre, tallyMerge } from '@analys/util-pivot'
import { ACCUM, COUNT, INCRE, MERGE }                    from '@analys/enum-pivot-mode'
import { iterate }                                       from '@vect/vector-mapper'

export class Pivot {
  constructor (x, y, z, mode, filter) {
    this.x = x
    this.y = y
    this.z = z
    this.data = { s: [], b: [], m: [], n: mode === INCRE || mode === COUNT ? () => 0 : () => [] }
    this.updater = Updater(this.data, mode)
    this.filter = filter
  }

  static build (x, y, z, mode, filter) { return new Pivot(x, y, z, mode, filter) }

  record (samples) { return iterate(samples, this.note.bind(this)), this }

  note (sample) { this.updater(sample[this.x], sample[this.y], sample[this.z]) }

  toObject () { return { side: this.data.s, head: this.data.b, rows: this.data.m } }
}

export const Updater = function (data, mode) {
  const ri = arid.bind(data), ci = acid.bind(data)
  if (mode === MERGE) return function (x, y, value) { return tallyMerge(data.m[ri(x)][ci(y)], value) }
  if (mode === ACCUM) return function (x, y, value) { return tallyIncre(data.m[ri(x)][ci(y)], value) }
  if (mode === INCRE) return function (x, y, value) { return data.m[ri(x)][ci(y)] += value }
  if (mode === COUNT) return function (x, y) { return data.m[ri(x)][ci(y)]++ }
  return ampliCell.bind(data)
}

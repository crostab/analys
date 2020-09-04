import { ACCUM, COUNT, INCRE, MERGE }                                from '@analys/enum-pivot-mode'
import { acid, ampliCell, arid, modeToInit, tallyIncre, tallyMerge } from '@analys/util-pivot'
import { iterate }                                                   from '@vect/vector-mapper'

export class PivotOri {
  constructor ([x, sidePick], [y, headPick], [z, mode], filter) {
    this.x = x
    this.sidePick = sidePick || (x => x)
    this.y = y
    this.headPick = headPick || (x => x)
    this.z = z
    this.data = { s: [], b: [], m: [], n: modeToInit(mode) }
    this.updater = Updater(this.data, mode)
    this.filter = filter
  }

  static build ({
    side: [x, sidePick],
    banner: [y, headPick],
    field: [z, mode],
    filter: filter,
  }) { return new PivotOri([x, sidePick], [y, headPick], [z, mode], filter) }

  record (samples) { return iterate(samples, this.note.bind(this)), this }

  note (sample) { this.updater(sample[this.x], sample[this.y], sample[this.z]) }

  toObject () { return { side: this.data.side, head: this.data.head, rows: this.data.rows } }
}

export const Updater = function (data, mode) {
  const ri = arid.bind(data), ci = acid.bind(data)
  if (mode === MERGE) return function (x, y, value) { return tallyMerge(data.rows[ri(this.sidePick(x))][ci(this.headPick(y))], value) }
  if (mode === ACCUM) return function (x, y, value) { return tallyIncre(data.rows[ri(this.sidePick(x))][ci(this.headPick(y))], value) }
  if (mode === INCRE) return function (x, y, value) { return data.rows[ri(this.sidePick(x))][ci(this.headPick(y))] += value }
  if (mode === COUNT) return function (x, y) { return data.rows[ri(this.sidePick(x))][ci(this.headPick(y))]++ }
  return ampliCell.bind(data)
}

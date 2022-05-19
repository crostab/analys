import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { Accumulators }               from '@analys/util-pivot'

const { merge, accum } = Accumulators

export const ObjectRecorder = mode => {
  if (mode === MERGE) return function (x, v) { if (x in this) { merge(this[x], v) } else { this[x] = v.slice() } }
  if (mode === ACCUM) return function (x, v) { if (x in this) { accum(this[x], v) } else { this[x] = [v] } }
  if (mode === INCRE) return function (x, v) { if (x in this) { this[x] += v } else { this[x] = v } }
  if (mode === COUNT) return function (x) { if (x in this) { this[x]++ } else { this[x] = 1 } }
  return () => {}
}

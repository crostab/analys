import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { acquire } from '@vect/merge-acquire'

export const ObjectRecorder = mode => {
  if (mode === INCRE) return function (x, v) {
    if (x in this) { this[x] += v } else { this[x] = v }
  }
  if (mode === ACCUM) return function (x, v) {
    const ve = this[x]
    if (ve) { ve.push(v) } else { this[x] = [v] }
  }
  if (mode === COUNT) return function (x) {
    if (x in this) { this[x]++ } else { this[x] = 1 }
  }
  if (mode === MERGE) return function (x, v) {
    const ve = this[x]
    if (ve) { acquire(ve, v) } else { this[x] = v}
  }
  return () => {}
}

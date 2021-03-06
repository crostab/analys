import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { Accumulators }               from '@analys/util-pivot'

const { merge, accum } = Accumulators
export const findEntry = function (key) {
  return this.find(([k]) => key === k)
}

export const EntriesRecorder = mode => {
  if (mode === MERGE) return function (x, v) {
    const en = findEntry.call(this, x)
    if (en) { merge(en[1], v) } else { this.push([x, v.slice()]) }
  }
  if (mode === ACCUM) return function (x, v) {
    const en = findEntry.call(this, x)
    if (en) { accum(en[1], v) } else { this.push([x, [v]]) }
  }
  if (mode === INCRE) return function (x, v) {
    const en = findEntry.call(this, x)
    if (en) { en[1] += v } else { this.push([x, v]) }
  }
  if (mode === COUNT) return function (x) {
    const en = findEntry.call(this, x)
    if (en) { en[1]++ } else { this.push([x, 1]) }
  }
  return () => {}
}

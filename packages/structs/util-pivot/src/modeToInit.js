import { ACCUM, AVERAGE, COUNT, FIRST, INCRE, LAST, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'

export const modeToInit = mode => {
  if (mode === MERGE || mode === ACCUM) return () => []
  if (mode === INCRE || mode === COUNT) return () => 0
  if (mode === AVERAGE) return () => ({ s: 0, n: 0, get value () { return this.s / this.n } })
  if (mode === MAX) return () => Number.NEGATIVE_INFINITY
  if (mode === MIN) return () => Number.POSITIVE_INFINITY
  if (mode === FIRST || mode === LAST) return () => void 0
  return () => []
}

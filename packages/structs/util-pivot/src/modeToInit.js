import { ACCUM, AVERAGE, COUNT, INCRE, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'

export const modeToInit = mode => {
  if (mode === MERGE || mode === ACCUM) return () => []
  if (mode === INCRE || mode === COUNT || mode === AVERAGE) return () => 0
  if (mode === MAX) return () => Number.NEGATIVE_INFINITY
  if (mode === MIN) return () => Number.POSITIVE_INFINITY
  return () => []
}

import { ACCUM, COUNT, INCRE, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'
import { max, min }                             from '@aryth/comparer'
import { acquire }                              from '@vect/merge-acquire'

export const tallyMerge = (target, value) => acquire(target, value)
export const tallyAccum = (target, value) => (target.push(value), target)
export const tallyIncre = (target, value) => target + value
export const tallyCount = (target) => target + 1
export const tallyMax = (target, value) => max(target, value)
export const tallyMin = (target, value) => min(target, value)

export const modeToTally = (mode) => {
  if (mode === MERGE) return tallyMerge
  if (mode === ACCUM) return tallyAccum
  if (mode === INCRE) return tallyIncre
  if (mode === COUNT) return tallyCount
  if (mode === MAX) return tallyMax
  if (mode === MIN) return tallyMin
  return () => {}
}

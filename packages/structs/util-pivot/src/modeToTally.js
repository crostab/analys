import { ACCUM, AVERAGE, COUNT, FIRST, INCRE, LAST, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'
import { max, min }                                                   from '@aryth/comparer'
import { acquire }                                                    from '@vect/vector-merge'

export const tallyMerge = (target, value) => acquire(target, value)
export const tallyAccum = (target, value) => (target.push(value), target)
export const tallyIncre = (target, value) => target + value
export const tallyCount = (target, value) => target + 1
export const tallyAverage = (target, value) => (target.sum += value, target.count += 1, target)
export const tallyMax = (target, value) => max(target, value)
export const tallyMin = (target, value) => min(target, value)
export const tallyFirst = (target, value) => target ?? value
export const tallyLast = (target, value) => value ?? target

export const modeToTally = (mode) => {
  if (mode === MERGE) return tallyMerge
  if (mode === ACCUM) return tallyAccum
  if (mode === INCRE) return tallyIncre
  if (mode === COUNT) return tallyCount
  if (mode === AVERAGE) return tallyAverage
  if (mode === MAX) return tallyMax
  if (mode === MIN) return tallyMin
  if (mode === FIRST) return tallyFirst
  if (mode === LAST) return tallyLast
  return () => {}
}

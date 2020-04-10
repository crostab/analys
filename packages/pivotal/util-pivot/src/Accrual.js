import { ACCUM, COUNT, INCRE, MERGE } from '@analys/enum-pivot-mode'
import { acquire }                    from '@vect/merge-acquire'

export const tallyMerge = (target, value) => acquire(target, value)
export const tallyAccum = (target, value) => (target.push(value), target)
export const tallyIncre = (target, value) => target + value
export const tallyCount = (target) => target++

export const Accrual = (mode) => {
  if (mode === MERGE) return tallyMerge
  if (mode === ACCUM) return tallyAccum
  if (mode === INCRE) return tallyIncre
  if (mode === COUNT) return tallyCount
  return () => {}
}

import { max, min } from '@aryth/comparer'
import { FUN }      from '@typen/enum-data-types'
import { nullish }  from '@typen/nullish'
import { acquire }  from '@vect/vector-algebra'

export const NaiveAccumulators = {
  merge: (target, value) => acquire(target, value),
  accum: (target, value) => (target.push(value), target),
  incre: (target, value) => target + value,
  count: (target, value) => target + 1,
  average: (target, value) => (target.sum += value, target.count += 1, target),
  max: (target, value) => max(target, value),
  min: (target, value) => min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target,
}

export const Accumulators = {
  merge: (target, value) => nullish(value) ? target : acquire(target, value),
  accum: (target, value) => nullish(value) ? target : (target.push(value), target),
  incre: (target, value) => nullish(value) ? target : (target + value),
  count: (target, value) => nullish(value) ? target : (target + 1),
  average: (target, value) => nullish(value) ? target : (target.sum += value, target.count += 1, target),
  max: (target, value) => nullish(value) ? target : max(target, value),
  min: (target, value) => nullish(value) ? target : min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target,
}

export const modeToTally = (mode) => {
  let accumulators = Accumulators
  if (Array.isArray(mode)) {
    accumulators = mode[1] ?? Accumulators
    mode = mode[0]
  }
  if (typeof mode === FUN) return mode
  if (mode in accumulators) return accumulators[mode]
  return () => {}
}

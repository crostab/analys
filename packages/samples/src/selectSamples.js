import { mapper as mapperObject } from '@vect/object-mapper'
import { iterate, mapper } from '@vect/vector-mapper'

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {null|{head:*[],rows:*[][]}}
 */
export function selectSamples (samples, fields) {
  if (!Array.isArray(fields)) return mapper(samples, sample => mapperObject(sample, x => x))
  const assigners = mapper(fields, toAssigner)
  return mapper(samples, sample => {
    let target = {}
    return iterate(assigners, assigner => {assigner(target, sample)}), target
  })
}

export const toAssigner = field =>
  Array.isArray(field)
    ? assignProjectedField.bind({ curr: field[0], proj: field[1] })
    : assignField.bind({ field })

export const assignField = function (target, sample) {
  let { field } = this
  target[field] = sample[field]
}

export const assignProjectedField = function (target, sample) {
  let { proj, curr } = this
  target[proj] = sample[curr]
}

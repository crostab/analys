import { mapper as mapperObject } from '@vect/object-mapper'
import { iterate, mapper }        from '@vect/vector-mapper'

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {null|{head:*[],rows:*[][]}}
 */
export function samplesSelect (samples, fields) {
  if (fields?.length) {
    const assigners = mapper(fields, field => Array.isArray(field)
      ? assigner.bind({ k: field[0], p: field[1] })
      : assigner.bind({ k: field })
    )
    return mapper(samples, sample => {
      let target = {}
      iterate(assigners, fn => fn(target, sample))
      return target
    })
  }
  return mapper(samples, sample => mapperObject(sample, x => x))
}

export const assigner = function (target, source) { target[this.p ?? this.k] = source[this.k] }

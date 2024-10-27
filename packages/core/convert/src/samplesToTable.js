import { voidTabular } from '@analys/tabular'
import { unwind }      from '@vect/entries-unwind'
import { iterate, mapper } from '@vect/vector-mapper'
import { select }          from '@vect/vector-select'
import { toTable }         from './tabularToTable'

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {Table}
 */
export const samplesToTable = (samples, fields) =>
  toTable(samplesToTabular(samples, fields))

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {TableObject}
 */
export function samplesToTabular(samples, fields) {
  let height, width
  if (!(height = samples?.length)) return voidTabular()
  if (!fields?.length) return convertSamplesToTabular(samples)
  const [keys, head] = unwind(selectFieldMapping.call(samples[0], fields))
  if (!(width = keys?.length)) return voidTabular()
  const rows = mapper(samples, sample => select(sample, keys, width), height)
  return { head, rows }
}

export const selectFieldMapping = function (fields) {
  const sample = this, mapping = [], fieldMapper = fieldMapping.bind(sample)
  let kvp
  iterate(fields, field => { if ((kvp = fieldMapper(field))) mapping.push(kvp) })
  return mapping
}
/**
 *
 * @param {str|[*,*]} [field]
 * @returns {[str,number]}
 */
export const fieldMapping = function (field) {
  const sample = this
  if (Array.isArray(field)) {
    const [current, projected] = field
    return current in sample
      ? [current, projected]
      : null
  }
  return field in sample
    ? [field, field]
    : null
}

export function convertSamplesToTabular(samples) {
  const height = samples?.length
  if (!height) return voidTabular()
  const rows = Array(height)
  let head;
  [head, rows[0]] = unwind(Object.entries(samples[0]))
  for (let i = 1, w = head?.length; i < height; i++) rows[i] = select(samples[i], head, w)
  return { head, rows }
}


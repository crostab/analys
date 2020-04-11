import { unwind }          from '@vect/entries-unwind'
import { iterate, mapper } from '@vect/vector-mapper'

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {TableObject}
 */
export function samplesToTable (samples, fields) {
  let h, w
  if (!(h = samples?.length)) return voidTable()
  if (!fields?.length) return samplesToTableDirectly(samples)
  const [keys, head] = lookupKeyHeadPairs.call(samples[0], fields) |> unwind
  if (!(w = keys?.length)) return voidTable()
  const rows = mapper(samples, sample => mapper(keys, key => sample[key], w), h)
  return { head, rows }
}

const voidTable = () => ({ head: [], rows: [[]] })

export const lookupKeyHeadPairs = function (fields) {
  const sample = this, keyHeadPairs = []
  let keyHead
  iterate(fields, field => {
    if ((keyHead = lookupKeyHeadPair.call(sample, field))) keyHeadPairs.push(keyHead)
  })
  return keyHeadPairs
}
/**
 *
 * @param {str|[*,*]} [field]
 * @returns {[str,number]}
 */
export const lookupKeyHeadPair = function (field) {
  const sample = this
  if (!Array.isArray(field) && (field in sample)) return [field, field]
  let [current, projected] = field
  return current in sample ? [current, projected] : void 0
}

export function samplesToTableDirectly (samples) {
  const h = samples?.length
  let head, rows = Array(h)
  if (h) {
    [head, rows[0]] = Object.entries(samples[0]) |> unwind
    for (let i = 1, sample, w = head.length; i < h; i++)
      sample = samples[i], rows[i] = mapper(head, field => sample[field], w)
  }
  return { head, rows }
}


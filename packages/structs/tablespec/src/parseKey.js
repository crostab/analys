import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { nullish }       from '@typen/nullish'

export const parseKey = (key) => {
  if (nullish(key)) return [key]
  let t = typeof key
  if (t === STR || t === NUM) return [key]
  if (t === OBJ) return Array.isArray(key) ? key : Object.entries(key)
  return key
}

/**
 * @param key
 * @return {[*,*]}
 */
export const parseKeyOnce = (key) => {
  if (nullish(key)) return [key]
  let t = typeof key
  if (t === STR || t === NUM) return [key]
  if (t === OBJ) return Array.isArray(key) ? key : getEntryOnce(key)
  return [key]
}

/**
 *
 * @param {Object} o
 * @return {*}
 */
const getEntryOnce = o => { for (let k in o) return [k, o[k]] }

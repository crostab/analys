import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { isNumStr }      from '@typen/literal'
import { nullish }       from '@typen/nullish'

/**
 * @typedef {string|number} str
 */

/**
 *
 * @param {str|str[]|Object<str,Function>|[string,Function][]} field
 * @param {number} level
 * @returns {{key:str,to:number}|{key:str,to:number}[]}
 */
export function parseKey(field, level = 0) {
  const { key: defaultKey = '', to: defaultTo = null } = this ?? {}
  const fieldSets = []
  if (nullish(field)) fieldSets.push({ key: defaultKey, to: defaultTo })
  else if (isNumStr(field)) fieldSets.push({ key: field, to: defaultTo })
  else if (Array.isArray(field)) {
    if (level > 0) fieldSets.push({ key: field[0], to: field[1] })
    else for (let f of field) fieldSets.push(...parseField.call(this, f, level + 1))
  } else if (typeof field === OBJ) {
    for (let [key, to] of Object.entries(field)) fieldSets.push({ key, to })
  }
  return fieldSets
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

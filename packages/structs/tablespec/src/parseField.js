import { OBJ }      from '@typen/enum-data-types'
import { isNumStr } from '@typen/literal'
import { nullish }  from '@typen/nullish'

/**
 * @typedef {string|number} str
 */

/**
 *
 * @param {str|str[]|Object<str,Function>|[string,Function][]} field
 * @param {number} level
 * @returns {{key:str,to:number}[]}
 */
export function parseField(field, level = 0) {
  const { key: defaultKey = '', to: defaultTo = null } = this ?? {}
  const fieldSets = []
  if (nullish(field)) fieldSets.push({ key: defaultKey, to: defaultTo })
  else if (isNumStr(field)) fieldSets.push({ key: field, to: defaultTo })
  else if (Array.isArray(field)) {
    if (level <= 0) {
      for (let element of field) fieldSets.push(...parseField.call(this, element, level + 1))
    } else {
      fieldSets.push({ key: field[0], to: field[1] })
    }
  } else if (typeof field === OBJ) {
    for (let [key, to] of Object.entries(field)) fieldSets.push({ key, to })
  }
  return fieldSets
}
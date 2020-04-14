import { COUNT, INCRE }  from '@analys/enum-pivot-mode'
import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { nullish }       from '@typen/nullish'
import { acquire }       from '@vect/merge-acquire'

/**
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */
export const parseField = (field, neglect) => {
  let t = typeof field, ents
  if (nullish(field)) return [neglect, COUNT]
  if (t === OBJ) {
    ents = Array.isArray(field)
      ? parseFields(field, neglect)
      : Object.entries(field)
    if (ents.length === 0) return [neglect, COUNT]
    if (ents.length === 1) return ents[0]
    return ents
  }
  if (t === STR || t === NUM) return [field, INCRE]
  return [neglect, COUNT]
}

export const parseFields = (fields, neglect) => {
  let ents = [], t
  for (let field of fields)
    if (nullish(field)) { ents.push([neglect, COUNT]) }
    else if (Array.isArray(field)) { ents.push(field) }
    else if ((t = typeof field) && (t === STR || t === NUM)) { ents.push([field, INCRE]) }
    else if (t === OBJ) { acquire(ents, Object.entries(field)) }
    else { ents.push([neglect, COUNT]) }
  return ents
}

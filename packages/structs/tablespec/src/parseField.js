import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { COUNT, INCRE }  from '@analys/enum-pivot-mode'
import { acquire }       from '@vect/merge-acquire'
import { isMatrix }      from '@vect/matrix'

/**
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */
export const parseField = (field, neglect) => {
  if (field === void 0 || field === null) return [neglect, COUNT]
  let t = typeof field, ents
  if (t === OBJ) {
    if (Array.isArray(field) && (ents = [])) {
      field.map(subField => parseField(subField, neglect))
        .forEach(subField => isMatrix(subField) ? acquire(ents, subField) : ents.push(subField))
    } else {
      ents = Object.entries(field)
    }
    if (ents.length === 0) return [neglect, COUNT]
    if (ents.length === 1) return ents[0]
    return ents
  }
  if (t === STR || t === NUM) return [field, INCRE]
  return [neglect, COUNT]
}

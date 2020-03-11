import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { COUNT, INCRE } from '@analys/enum-pivot-mode'
import { acquire } from '@vect/merge-acquire'
import { iterate } from '@vect/vector-mapper'
import { isMatrix } from '@vect/matrix'

/**
 *
 * @param {*} fieldSet
 * @param {str} def - default field
 * @returns {[str,number]|[str,number][]}
 */
export const parseFieldSet = (fieldSet, def) => {
  if (fieldSet === void 0 || fieldSet === null) return [def, COUNT]
  switch (typeof fieldSet) {
    case OBJ:
      let ents
      if (Array.isArray(fieldSet) && (ents = [])) {
        iterate(fieldSet, f => (f = parseFieldSet(f, def), isMatrix(f) ? acquire(ents, f) : ents.push(f)))
      } else {
        ents = Object.entries(fieldSet)
      }
      if (ents.length === 0) return [def, COUNT]
      if (ents.length === 1) return ents[0]
      return ents
    case STR:
    case NUM:
      return [fieldSet, INCRE]
    default:
      return [def, COUNT]
  }
}

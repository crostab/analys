import { vectorType }    from '@typen/vector-type'
import { columnsMapper } from '@vect/columns-mapper'

// { inferType, omitNull = true }
export const inferTypes = function (options = {}) {
  return columnsMapper(this?.rows, vectorType.bind(options))
}

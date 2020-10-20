import { mapper as mapperColumns } from '@vect/columns-mapper'
import { VectorType } from '@typen/vector-type'

export const inferTypes = function ({ inferType, omitNull = true } = {}) {
  const table = this
  return mapperColumns(table.rows, VectorType({ inferType, omitNull }))
}

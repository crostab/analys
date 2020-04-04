import { mapper as mapperColumns } from '@vect/columns-mapper'
import { vectorType } from '@typen/vector-type'

export const inferTypes = function ({ inferType } = {}) {
  const table = this
  return mapperColumns(table.rows, vectorType.bind(inferType))
}

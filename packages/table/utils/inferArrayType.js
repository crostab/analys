import { inferType } from '@typen/num-strict'

/**
 *
 * @param {*[]} column
 * @return {string|unknown}
 */
export function inferArrayType (column) {
  if (!column.length) return 'null'
  const types = column.map(inferType)
  const distinct = new Set(types)
  switch (new Set(types).size) {
    case 1:
      return types[0]
    case 2:
      return distinct.has('number') && distinct.has('numstr') ? 'numstr' : 'misc'
    default:
      return 'misc'
  }
}


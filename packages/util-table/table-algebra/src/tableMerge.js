import { tableJoin } from './tableJoin'

export function merge(...tables) {
  const { fields, joinType, fillEmpty } = this
  const n = tables.length
  if (n === 0) return null
  if (n === 1) return tables[0]
  if (n === 2) return tableJoin(tables[0], tables[1], fields, joinType, fillEmpty)
  return tables.reduce((accum, next) => tableJoin(accum, next, fields, joinType, fillEmpty))
}
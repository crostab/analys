import { coin } from '@analys/table-index'
import { Columns } from '@vect/column-getter'
import { wind as windEnts } from '@vect/entries-init'
import { wind as windOb } from '@vect/object-init'

export const lookupTable = function (key, field, objectify) {
  const table = this, getColumn = Columns(table.rows)
  const [ki, vi] = [coin.call(table, key), coin.call(table, field)]
  return ki >= 0 && vi >= 0
    ? objectify
      ? windOb(getColumn(ki), getColumn(vi))
      : windEnts(getColumn(ki), getColumn(vi))
    : objectify ? {} : []
}

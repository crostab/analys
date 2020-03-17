import { coin } from '@analys/table-index'
import { Columns } from '@vect/column-getter'
import { wind as windEnts } from '@vect/entries-init'
import { wind as windOb } from '@vect/object-init'

export const lookupTable = function (keyField, valueField, objectify = true) {
  const table = this, getColumn = Columns(table.rows)
  const [ki, vi] = [coin.call(table, keyField), coin.call(table, valueField)]
  return ki >= 0 && vi >= 0
    ? objectify
      ? windOb(getColumn(ki), getColumn(vi))
      : windEnts(getColumn(ki), getColumn(vi))
    : objectify ? {} : []
}

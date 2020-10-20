import { coin }                from '@analys/table-index'
import { Columns }             from '@vect/column-getter'
import { wind as windEntries } from '@vect/entries-init'
import { wind as windObject }  from '@vect/object-init'

export const lookupTable = function (key, field, objectify) {
  const table = this, getColumn = Columns(table.rows)
  const [ki, vi] = [coin.call(table, key), coin.call(table, field)]
  return ki >= 0 && vi >= 0
    ? objectify
      ? windObject(getColumn(ki), getColumn(vi))
      : windEntries(getColumn(ki), getColumn(vi))
    : objectify
      ? {}
      : []
}

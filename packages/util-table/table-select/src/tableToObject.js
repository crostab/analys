import { coin }                                     from '@analys/table-index'
import { matchSlice }                               from '@analys/table-init'
import { selectTabularToSamples, tabularToSamples } from '@analys/tabular'
import { nullish }                                  from '@typen/nullish'
import { column }                                   from '@vect/column-getter'
import { wind as windEntries }                      from '@vect/entries-init'
import { wind as windObject }                       from '@vect/object-init'

/**
 *
 * @param {string} key
 * @param {string|string[]|[string,string][]} [field]
 * @param objectify
 * @return {Object|Array}
 */
export const tableToObject = function (key, field, objectify = true) {
  const table = this
  const
    hi = table?.rows?.length
  let x, y
  const keys = ((x = coin.call(table, key)) >= 0) ? column(table.rows, x, hi) : null
  const values = nullish(field) || Array.isArray(field)
    ? field?.length
      ? selectTabularToSamples.call(matchSlice(table), field)
      : tabularToSamples.call(matchSlice(table))
    : ((y = coin.call(table, field)) >= 0)
      ? column(table.rows, y, hi)
      : null
  return keys && values
    ? objectify
      ? windObject(keys, values)
      : windEntries(keys, values)
    : objectify
      ? {}
      : []
}
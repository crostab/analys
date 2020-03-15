import { selectKeyedColumns } from '@analys/keyed-columns'
import { slice } from '@analys/table-init'

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @param {boolean=true} [mutate]
 * @returns {TableObject}
 */
export const tableSelect = function (table, fields, { mutate = false } = {}) {
  let o = mutate ? table : table |> slice
  if (fields?.length) selectKeyedColumns.call(o, fields)
  return o
}

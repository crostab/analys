import { slice }         from '@analys/table-init'
import { selectTabular } from '@analys/tabular'

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @param {boolean=true} [mutate]
 * @returns {TableObject}
 */
export const tableSelect = function (table, fields, { mutate = false } = {}) {
  let o = mutate ? table : slice(table)
  if (fields?.length) selectTabular.call(o, fields)
  return o
}

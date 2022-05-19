import { tabularToSamples, selectTabularToSamples } from '@analys/tabular'
import { matchSlice }                               from '@analys/table-init'

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} util-samples
 */
export const tableToSamples = (table, fields) =>
  fields?.length
    ? selectTabularToSamples.call(matchSlice(table), fields)
    : tabularToSamples.call(matchSlice(table))

import { keyedColumnsToSamples, selectSamplesByHead } from '@analys/keyed-columns'
import { matchSlice }                                 from '@analys/table-init'

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} samples
 */
export const tableToSamples = (table, fields) =>
  fields?.length
    ? selectSamplesByHead.call(matchSlice(table), fields)
    : keyedColumnsToSamples.call(matchSlice(table))

import { VLKP }        from '@analys/enum-lookups'
import { lookupTable } from './lookupTable'

export const lookupCached = function (valueToFind, key, field) {
  const table = this
  let ds, dict
  if (!(ds = table[VLKP]) || !(dict = ds.dict) || ds.key !== key || ds.value !== field)
    table[VLKP] = {
      dict: (dict = lookupTable.call(table, key, field, true)),
      key: key,
      value: field
    }
  return dict[valueToFind]
}

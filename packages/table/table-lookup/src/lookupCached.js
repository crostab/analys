import { VLKP } from '@analys/enum-lookups'
import { lookupTable } from './lookupTable'

export const lookupCached = function (valueToFind, keyField, valueField) {
  const table = this
  let ds, dict
  if (!(ds = table[VLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField)
    table[VLKP] = {
      dict: (dict = lookupTable.call(table, keyField, valueField)),
      key: keyField,
      value: valueField
    }
  return dict[valueToFind]
}

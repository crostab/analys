import { VLKP } from '@analys/enum-lookups'
import { lookupTable } from './lookupTable'

export const lookupCached = function (valueToFind, key, field) {
  const table = this
  let dset, dict
  if (!(dset = table[VLKP]) || !(dict = dset.dict) || dset.key !== key || dset.value !== field)
    table[VLKP] = {
      dict: (dict = lookupTable.call(table, key, field, true)),
      key: key,
      value: field
    }
  return dict[valueToFind]
}

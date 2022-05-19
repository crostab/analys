import { HLKP } from '@analys/enum-lookups'
import { hlookupTable } from './hlookupTable'

export const hlookupCached = function (valueToFind, keyField, valueField) {
  const crostab = this
  let ds, dict
  if (!(ds = crostab[HLKP]) || !(dict = ds.dict) || ds.key !== keyField || ds.value !== valueField)
    crostab[HLKP] = {
      dict: (dict = hlookupTable.call(crostab, keyField, valueField)),
      key: keyField,
      value: valueField
    }
  return dict[valueToFind]
}

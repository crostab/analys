import { wind as windEnts } from '@vect/entries-init'
import { wind as windOb } from '@vect/object-init'

export const hlookupTable = function (keyField, valueField, objectify = true) {
  const crostab = this, { side, rows } = crostab
  const ki = side.indexOf(keyField), vi = side.indexOf(valueField);
  return ki >= 0 && vi >= 0
    ? objectify
      ? windOb(rows[ki], rows[vi])
      : windEnts(rows[ki], rows[vi])
    : objectify ? {} : []
}

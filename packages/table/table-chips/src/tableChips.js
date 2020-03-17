import { ACCUM } from '@analys/enum-pivot-mode'
import { EntriesRecorder } from '../utils/EntriesRecorder'
import { ObjectRecorder } from '../utils/ObjectRecorder'

export const tableChips = function ({
  key,
  field,
  mode = ACCUM,
  objectify = true
} = {}) {
  const { head, rows } = this, l = rows.length
  const ki = head.indexOf(key), vi = head.indexOf(field)
  let chips, row
  const note = objectify
    ? ObjectRecorder(mode).bind(chips = {})
    : EntriesRecorder(mode).bind(chips = [])
  for (let i = 0; i < l && (row = rows[i]); i++)
    note(row[ki], row[vi])
  return chips
}

import { Chips }       from '@analys/chips'
import { Group }       from '@analys/group'
import { samplesFind } from '@analys/samples-find'
import { parseField }  from '@analys/tablespec'
import { isMatrix }    from '@vect/matrix'

export const samplesGroup = function ({
  key,
  field,
  filter
} = {}) {
  let samples = this
  if (filter) {samples = samplesFind.call(samples, filter) }
  let multipleField
  const groupingEngine = isMatrix(field = parseField(field, key)) // field |> deco |> says['parsed field']
    ? (multipleField = true,
      new Group(key, field))
    : (multipleField = false,
      new Chips(key, field[0], field[1]))
  return groupingEngine.record(samples).toSamples()

}

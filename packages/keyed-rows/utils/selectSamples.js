import { iterate, mapper } from '@vect/vector-mapper'
import { transpose } from '@vect/matrix-transpose'

export const selectSamples = function (fieldIndexPairs) {
  const { rows } = this, columns = transpose(rows), depth = fieldIndexPairs?.length
  return mapper(columns, column => {
    let o = {}
    iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth)
    return o
  })
}

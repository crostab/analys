import { iterate, mapper } from '@vect/vector-mapper'

export const selectSamples = function (fieldIndexPairs) {
  const { rows } = this, depth = fieldIndexPairs?.length
  return mapper(rows, row => {
    let o = {}
    iterate(fieldIndexPairs, ([field, index]) => o[field] = row[index], depth)
    return o
  })
}

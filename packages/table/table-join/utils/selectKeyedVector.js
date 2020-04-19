import { select }  from '@vect/vector-select'
import { splices } from '@vect/vector-update'

export const selectKeyedVector = function (vec) {
  let { indexes, asc, depth } = this
  // depth = depth || indexes.length, asc = asc || indexes.sort(NUM_ASC)
  return depth === 1
    ? {
      key: [vec[indexes[0]]],
      vector: (vec.splice(indexes[0], 1), vec)
    }
    : {
      key: select(vec, indexes, depth),
      vector: splices(vec, asc, depth)
    }
}

import { INTERSECT, LEFT, RIGHT, UNION }             from '@analys/enum-join-modes'
import { iso }                                       from '@vect/vector-init'
import { iterate }                                   from '@vect/vector-mapper'
import { lookupKeyedVector, lookupKeyedVectorIndex } from '../utils/lookupKeyedVector'

/**
 * @param joinType
 * @returns {function(MultiKeyedVector[], MultiKeyedVector[], number?):*[][]}
 */
export const Joiner = (joinType) => {
  if (joinType === UNION) { return joinUnion }
  if (joinType === LEFT) { return joinLeft }
  if (joinType === RIGHT) { return joinRight }
  if (joinType === INTERSECT) { return joinIntersect }
  return joinIntersect
}

/** @typedef {{keyIndex:*[],vector:*[]}} MultiKeyedVector */

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @returns {*[][]}
 */
const joinIntersect = (L, R) => {
  const rows = []
  iterate(L,
    ({ key, vector }) => {
      let another = lookupKeyedVector.call(R, key)
      if (another) rows.push(key.concat(vector, another))
    })
  return rows
}

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinUnion = (L, R, n) => {
  const leftL = L.length, rows = Array(leftL), joinedIndexes = new Set(),
    wL = L[0]?.vector?.length, wR = R[0]?.vector?.length
  iterate(L,
    ({ key, vector }, i) => {
      let j = lookupKeyedVectorIndex.call(R, key)
      rows[i] = j >= 0 && joinedIndexes.add(j)
        ? key.concat(vector, R[j].vector)
        : key.concat(vector, iso(wR, n))
    })
  iterate(R,
    ({ key, vector }, j) =>
      !joinedIndexes.has(j)
        ? rows.push(key.concat(iso(wL, n), vector))
        : void 0
  )
  return rows
}

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinLeft = (L, R, n) => {
  let rows = Array(L.length), w = R[0]?.vector?.length, another
  iterate(L,
    ({ key, vector }, i) =>
      rows[i] = (another = lookupKeyedVector.call(R, key))
        ? key.concat(vector, another)
        : key.concat(vector, iso(w, n))
  )
  return rows
}

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinRight = (L, R, n) => {
  let rows = Array(R.length), w = L[0]?.vector?.length, another
  iterate(R,
    ({ key, vector }, i) =>
      rows[i] = (another = lookupKeyedVector.call(L, key))
        ? key.concat(another, vector)
        : key.concat(iso(w, n), vector)
  )
  return rows
}









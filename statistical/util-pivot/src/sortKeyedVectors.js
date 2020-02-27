import { zipper } from '@vect/vector-zipper'

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {*[]} keys
 * @param {*[][]} vectors
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {[*[], *[][]]}
 */
export const sortKeyedVectors = (keys, vectors, comparer, index) => {
  const keyComparer = (a, b) => comparer(a[0], b[0])
  const newKeys = Array(keys.length)
  const newVectors = index >= 0
    ? zipper(keys, vectors, (key, vector) => [vector[index], key, vector])
      .sort(keyComparer)
      .map(([, k, r], i) => (newKeys[i] = k , r))
    : zipper(keys, vectors, (key, vector) => [key, vector])
      .sort(keyComparer)
      .map(([k, r], i) => (newKeys[i] = k, r))
  return [newKeys, newVectors]
}

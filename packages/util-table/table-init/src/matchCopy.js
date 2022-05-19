import { cloneArray } from '@vect/clone'

/**
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
export const matchSlice = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix
  return ({ head, rows })
}

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
export const matchShallow = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix
  return ({
    head: head.slice(),
    rows: rows.map(row => row.slice())
  })
}

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
export const matchClone = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix
  return {
    head: head.slice(),
    rows: cloneArray(rows)
  }
}

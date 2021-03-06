import { Mx } from 'veho'

/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */
export const matchSlice = (o) => {
  const side = o.side, head = o.head || o.banner, rows = o.rows || o.matrix
  return ({ side, head, rows })
}

/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */
export const matchShallow = (o) => {
  const side = o.side, head = o.head || o.banner, rows = o.rows || o.matrix
  return ({
    side: side.slice(),
    head: head.slice(),
    rows: rows.map(row => row.slice())
  })
}

/**
 *
 * @param {Object} o - CrosTab like
 * @returns {CrostabObject}
 */
export const matchClone = (o) => {
  const side = o.side, head = o.head || o.banner, rows = o.rows || o.matrix
  return ({
    side: side.slice(),
    head: head.slice(),
    rows: Mx.clone(rows)
  })
}

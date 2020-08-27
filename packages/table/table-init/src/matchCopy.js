import { Mx } from 'veho'

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
  return ({
    head: head.slice(),
    rows: Mx.clone(rows)
  })
}

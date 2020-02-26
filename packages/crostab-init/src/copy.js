import { Mx } from 'veho'

/** @typedef {{side:*[],head:*[],rows:*[][]}} CrostabObject */

/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */
export const slice = ({ side, head, rows }) => ({ side, head, rows })

/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */
export const shallow = ({ side, head, rows }) => ({
  side: side.slice(),
  head: head.slice(),
  rows: rows.map(row => row.slice())
})

/**
 *
 * @param {*[]} side
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {CrostabObject}
 */
export const clone = ({ side, head, rows }) => ({
  side: side.slice(),
  head: head.slice(),
  rows: Mx.clone(rows)
})

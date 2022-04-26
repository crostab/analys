import { cloneArray } from '@vect/clone'

/** @typedef {{head:*[],rows:*[][]}} TableObject */

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
export const slice = ({ head, rows }) => ({ head, rows })

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
export const shallow = ({ head, rows }) => ({
  head: head.slice(),
  rows: rows.map(row => row.slice())
})

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
export const clone = ({ head, rows }) => ({
  head: head.slice(),
  rows: cloneArray(rows)
})

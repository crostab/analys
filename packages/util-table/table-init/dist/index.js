import { cloneArray } from '@vect/clone';

/** @typedef {{head:*[],rows:*[][]}} TableObject */

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
const slice = ({ head, rows }) => ({ head, rows });

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
const shallow = ({ head, rows }) => ({
  head: head.slice(),
  rows: rows.map(row => row.slice())
});

/**
 *
 * @param {*[]} head
 * @param {*[][]} rows
 * @returns {TableObject}
 */
const clone = ({ head, rows }) => ({
  head: head.slice(),
  rows: cloneArray(rows)
});

/**
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
const matchSlice = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix;
  return ({ head, rows })
};

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
const matchShallow = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix;
  return ({
    head: head.slice(),
    rows: rows.map(row => row.slice())
  })
};

/**
 *
 * @param {Object} o
 * @returns {TableObject}
 */
const matchClone = (o = {}) => {
  const head = o.head ?? o.banner, rows = o.rows ?? o.matrix;
  return {
    head: head.slice(),
    rows: cloneArray(rows)
  }
};

export { clone, matchClone, matchShallow, matchSlice, shallow, slice };

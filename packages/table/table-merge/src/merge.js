import { acquire, merge }  from '@vect/vector-merge'
import { mutazip, zipper } from '@vect/vector-zipper'

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */
export const tableAcquire = (ta, tb) => {
  acquire(ta.head, tb.head)
  mutazip(ta.rows, tb.rows, (va, vb) => acquire(va, vb))
  return ta
}

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */
export const tableMerge = (ta, tb) => {
  const head = merge(ta.head, tb.head)
  const rows = zipper(ta.rows, tb.rows, (va, vb) => merge(va, vb))
  return ta.copy ? ta.copy({ head, rows }) : { head, rows }
}

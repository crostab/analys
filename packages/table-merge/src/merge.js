import { acquire } from '@vect/merge-acquire'
import { merge } from '@vect/merge-acquire'
import { mutazip, zipper } from '@vect/vector-zipper'

export const tableAcquire = (ta, tb) => {
  acquire(ta.head, tb.head)
  mutazip(ta.rows, tb.rows, (va, vb) => acquire(va, vb))
  return ta
}

/**
 *
 * @param {Table} ta
 * @param {Table} tb
 * @returns {Table}
 */
export const tableMerge = (ta, tb) => {
  const head = merge(ta.head, tb.head)
  const rows = zipper(ta.rows, tb.rows, (va, vb) => merge(va, vb))
  return ta.copy ? ta.copy({ head, rows }) : { head, rows }
}

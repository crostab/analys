import { acquire, merge } from '@vect/merge-acquire';
import { mutazip, zipper } from '@vect/vector-zipper';

const tableAcquire = (ta, tb) => {
  acquire(ta.head, tb.head);
  mutazip(ta.rows, tb.rows, (va, vb) => acquire(va, vb));
  return ta;
};
/**
 *
 * @param {Table} ta
 * @param {Table} tb
 * @returns {Table}
 */

const tableMerge = (ta, tb) => {
  const head = merge(ta.head, tb.head);
  const rows = zipper(ta.rows, tb.rows, (va, vb) => merge(va, vb));
  return ta.copy({
    head,
    rows
  });
};

export { tableAcquire, tableMerge };

import { toKeyComparer } from '@analys/util-keyed-vectors'
import { zipper } from '@vect/vector-zipper'
import { Columns } from '@vect/column-getter'
import { unwind } from '@vect/entries-unwind'
import { transpose } from '@vect/matrix-transpose'

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{head:*[], rows:*[][]}}
 */
export const sortKeyedColumns = function (comparer, index) {
  if (index < 0) return sortColumnsByKeys.call(this, comparer)
  let { head, rows } = this, columns = transpose(rows)
  /** [column[i]s, head, columns]  */
  const Keyed = zipper(head, columns,
    (key, column) => [column[index], key, column]
  ).sort(
    toKeyComparer(comparer)
  ) |> Columns
  return { head: Keyed(1), rows: transpose(Keyed(2)) }
}

/**
 *
 * @param comparer
 * @returns {{head:*[], rows:*[][]}}
 */
export const sortColumnsByKeys = function (comparer) {
  let { head, rows } = this, columns = transpose(rows);
  [head, columns] = zipper(head, columns,
    (key, row) => [key, row]
  ).sort(
    toKeyComparer(comparer)
  ) |> unwind
  rows = transpose(columns)
  return { head, rows }
}

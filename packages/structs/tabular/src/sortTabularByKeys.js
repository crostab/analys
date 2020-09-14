import { transpose } from '@vect/matrix-transpose'
import { zipper } from '@vect/vector-zipper'
import { toKeyComparer } from '@analys/util-keyed-vectors'
import { unwind } from '@vect/entries-unwind'

/**
 *
 * @param comparer
 * @return {TableObject} - mutated 'this' {head, rows}
 */
export const sortTabularByKeys = function (comparer) {
  let { head, rows } = this, columns = transpose(rows);
  [this.head, columns] = zipper(head, columns,
    (key, row) => [key, row]
  ).sort(
    toKeyComparer(comparer)
  ) |> unwind
  this.rows = transpose(columns)
  return this
}

import { toKeyComparer } from '@analys/util-keyed-vectors'
import { zipper } from '@vect/vector-zipper'
import { Columns } from '@vect/column-getter'
import { transpose } from '@vect/matrix-transpose'

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {TableObject} - mutated 'this' {head, rows}
 */
export const sortTabular = function (comparer, index) {
  if (index < 0) return sortTabularByKeys.call(this, comparer)
  let { head, rows } = this, columns = transpose(rows)
  /** [column[i]s, head, columns]  */
  const Keyed = zipper(head, columns,
    (key, column) => [column[index], key, column]
  ).sort(
    toKeyComparer(comparer)
  ) |> Columns
  return this.head = Keyed(1), this.rows = transpose(Keyed(2)), this
}


import { toKeyComparer } from '@analys/util-keyed-vectors'
import { zipper } from '@vect/vector-zipper'
import { Columns } from '@vect/column-getter'
import { unwind } from '@vect/entries-unwind'

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{side:*[], rows:*[][]}}
 */
export const sortKeyedRows = function (comparer, index) {
  if (index < 0) return sortRowsByKeys.call(this, comparer)
  let { side, rows } = this
  /** Columns of [row[i]s, side, rows]  */
  const Cols = zipper(side, rows,
    (key, row) => [row[index], key, row]
  ).sort(
    toKeyComparer(comparer)
  ) |> Columns
  return { side: Cols(1), rows: Cols(2) }
}

/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */
export const sortRowsByKeys = function (comparer) {
  let { side, rows } = this;
  [side, rows] = zipper(side, rows,
    (key, row) => [key, row]
  ).sort(
    toKeyComparer(comparer)
  ) |> unwind
  return { side, rows }
}

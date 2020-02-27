import { toKeyComparer } from '@analys/util-keyed-vectors'
import { zipper } from '@vect/vector-zipper'
import { Columns } from '@vect/column-getter'

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @return {KeyedRows} - mutated 'this' {side, rows}
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
  return this.side = Cols(1), this.rows = Cols(2), this
}


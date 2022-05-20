import { zipper }        from '@vect/vector-zipper'
import { toKeyComparer } from '@analys/util-keyed-vectors'
import { unwind }        from '@vect/entries-unwind'


/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */
export function sortRowsByKeys(comparer) {
  let { side, rows } = this;
  [ this.side, this.rows ] = zipper(side, rows,
    (key, row) => [ key, row ]
  ).sort(
    toKeyComparer(comparer)
  ) |> unwind
  return this
}

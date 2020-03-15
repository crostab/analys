import { divide as divideMatrix } from '@vect/columns-select'
import { divide as divideVector } from '@vect/vector-select'
import { mapper } from '@vect/vector-mapper'
import { slice } from '@analys/table-init'
import { NUM_ASC } from '@aryth/comparer'

/**
 * Divide a table by fields
 * @param {*[]} fields
 * @return {{ pick:TableObject, rest:TableObject }} - mutated 'this' {head, rows}
 */
export const tableDivide = function (fields) {
  /** @type {Table|TableObject} */ const rs = this |> slice
  /** @type {Table|TableObject} */ const pk = this |> slice
  const { head, rows } = this
  const indexes = mapper(fields, label => head.indexOf(label)).sort(NUM_ASC);
  ({ pick: pk.head, rest: rs.head } = divideVector(head, indexes));
  ({ pick: pk.rows, rest: rs.rows } = divideMatrix(rows, indexes))
  return { pick: pk, rest: rs }
}


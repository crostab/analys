import { INTERSECT }         from '@analys/enum-join-modes'
import { NUM_ASC }           from '@aryth/comparer'
import { select }            from '@vect/vector-select'
import { splices }           from '@vect/vector-update'
import { selectKeyedVector } from '../utils/selectKeyedVector'
import { Joiner }            from './Joiner'

/**
 *
 * @param {Table|TableObject} tableL
 * @param {Table|TableObject} tableR
 * @param {str[]} fields
 * @param {number} [joinType=-1] - union:0,left:1,right:2,intersect:-1
 * @param {*} [fillEmpty]
 * @returns {Table|TableObject}
 */
export function tableJoin(
  tableL,
  tableR,
  fields,
  joinType  = INTERSECT,
  fillEmpty = null
) {
  if (!tableL?.head?.length || !tableL?.rows?.length) return tableR
  if (!tableR?.head?.length || !tableR?.rows?.length) return tableL
  const
    joiner  = Joiner(joinType),
    depth   = fields.length,
    indL    = fields.map(x => tableL.head.indexOf(x)),
    indR    = fields.map(x => tableR.head.indexOf(x)),
    ascL    = indL.slice().sort(NUM_ASC),
    ascR    = indR.slice().sort(NUM_ASC),
    keyVecL = selectKeyedVector.bind({ indexes: indL, asc: ascL, depth }),
    keyVecR = selectKeyedVector.bind({ indexes: indR, asc: ascR, depth })
  const head = select(tableL.head, indL).concat(splices(tableL.head.slice(), ascL), splices(tableR.head.slice(), ascR))
  const
    nextL = tableL.rows.map(row => keyVecL(row?.slice())),
    nextR = tableR.rows.map(row => keyVecR(row?.slice()))
  const rows = joiner(nextL, nextR, fillEmpty)
  return { head, rows, title: `${tableL.title} ${tableR.title}` }
}


// xr().fields(fields)['leftIndexes'](ascL)['rightIndexes'](ascR) |> logger
// xr().head(head |> deco) |> logger

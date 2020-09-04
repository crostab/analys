import { INTERSECT }         from '@analys/enum-join-modes'
import { NUM_ASC }           from '@aryth/comparer'
import { select }            from '@vect/vector-select'
import { splices }           from '@vect/vector-update'
import { selectKeyedVector } from '../utils/selectKeyedVector'
import { Joiner }            from './MatrixJoiner'

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
  joinType = INTERSECT,
  fillEmpty = null
) {
  if (!tableL?.head?.length || !tableL?.rows?.length) return tableR
  const
    joiner = Joiner(joinType), depth = fields.length,
    indexesL = fields.map(x => tableL.head.indexOf(x)), ascL = indexesL.slice().sort(NUM_ASC),
    indexesR = fields.map(x => tableR.head.indexOf(x)), ascR = indexesR.slice().sort(NUM_ASC),
    toKVL = selectKeyedVector.bind({ indexes: indexesL, asc: ascL, depth }),
    toKVR = selectKeyedVector.bind({ indexes: indexesR, asc: ascR, depth })
  const head = select(tableL.head, indexesL).concat(splices(tableL.head.slice(), ascL), splices(tableR.head.slice(), ascR))
  const
    L = tableL.rows.map(row => toKVL(row?.slice())),
    R = tableR.rows.map(row => toKVR(row?.slice()))
  const rows = joiner(L, R, fillEmpty)
  return { head, rows, title: `${ tableL.title } ${ tableR.title }` }
}

// xr().fields(fields)['leftIndexes'](ascL)['rightIndexes'](ascR) |> logger
// xr().head(head |> deco) |> logger

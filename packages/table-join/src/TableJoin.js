import { NUM_ASC } from '@aryth/comparer'
import { select } from '@vect/vector-select'
import { splices } from '@vect/vector-update'
import { Table } from '@analys/table'
import { Joiner } from './MatrixJoiner'
import { INTERSECT } from '../resources/JoinType'

export class TableJoin {
  /**
   *
   * @param {Table} tbL
   * @param {Table} tbR
   * @param {string[]|number[]} fields
   * @param {number} [joinType=-1] - union:0,left:1,right:2,intersect:-1
   * @param {*} [fillEmpty]
   * @returns {Table}
   */
  static join (tbL, tbR, fields, joinType = INTERSECT, fillEmpty = null) {
    const
      ysL = fields.map(x => tbL.coin(x)),
      ysR = fields.map(x => tbR.coin(x)),
      joiner = Joiner(joinType)
    const ys = ysL.slice().sort(NUM_ASC)
    const head = select(tbL.head, ysL).concat(splices(tbL.head.slice(), ys), splices(tbR.head.slice(), ys))
    const rows = joiner({ mx: tbL.rows, ys: ysL }, { mx: tbR.rows, ys: ysR }, fillEmpty)
    return new Table(head, rows, `${tbL.title} ${tbR.title}`)
  }
}

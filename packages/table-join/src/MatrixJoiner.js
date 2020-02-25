import { NUM_ASC } from '@aryth/comparer'
import { init } from '@vect/vector-init'
import { select } from '@vect/vector-select'
import { splices as splicesColumns } from '@vect/columns-update'
import { width } from '@vect/matrix-size'
import { Mx } from 'veho'
import { JoinTypes } from '../resources/JoinType'

const locInd = (mx, ys, vs, hi) =>
  mx.findIndex(row => {
    for (let i = 0; i < hi; i++) if (row[ys[i]] !== vs[i]) return false
    return true
  })

/**
 *
 * @param joinType
 * @returns {
 * (function({mx: *[][], ys: number[]}, {mx: *[][], ys: number[]}): *[][])
 * |(function({mx: *[][], ys: number[]}, {mx: *[][], ys: number[]}, *=): *[][])
 * }
 */
export const Joiner = (joinType) => {
  switch (joinType) {
    case JoinTypes.union:
      return MatrixJoiner.joinUnion
    case JoinTypes.left:
      return MatrixJoiner.joinLeft
    case JoinTypes.right:
      return MatrixJoiner.joinRight
    case JoinTypes.intersect:
    default:
      return MatrixJoiner.joinIntersect
  }
}

class MatrixJoiner {
  static joinUnion = ({ mx: mxL, ys: ysL }, { mx: mxR, ys: ysR }, fillEmpty) => {
    const
      hL = mxL.length, hR = mxR.length, hi = ysR.length,
      mx = Array(hL),
      mxL2 = splicesColumns(Mx.copy(mxL), ysL.slice().sort(NUM_ASC)), wL = width(mxL2),
      mxR2 = splicesColumns(Mx.copy(mxR), ysR.slice().sort(NUM_ASC)), wR = width(mxR2),
      idxRiLs = new Set()
    for (let i = 0, x, vsL; i < hL; i++) {
      vsL = select(mxL[i], ysL, hi)
      x = locInd(mxR, ysR, vsL, hi)
      if (x < 0) {
        mx[i] = vsL.concat(mxL2[i], init(wR, fillEmpty))
      } else {
        mx[i] = vsL.concat(mxL2[i], mxR2[x])
        idxRiLs.add(x)
      }
    }
    for (let i = 0, x, vsR; i < hR; i++) {
      if (idxRiLs.has(i)) {
        continue
      }
      vsR = select(mxR[i], ysR, hi)
      x = locInd(mxL, ysL, vsR, hi)
      if (x < 0) vsR.concat(init(wL, fillEmpty), mxR2[i]) |> mx.push
    }
    return mx
  }

  static joinLeft = ({ mx: mxL, ys: ysL }, { mx: mxR, ys: ysR }, fillEmpty) => {
    const
      hL = mxL.length, hi = ysL.length,
      mx = Array(hL),
      mxL2 = splicesColumns(Mx.copy(mxL), ysL.slice().sort(NUM_ASC)),
      mxR2 = splicesColumns(Mx.copy(mxR), ysR.slice().sort(NUM_ASC)), wR = width(mxR2)
    for (let i = 0, x, vsL; i < hL; i++) {
      vsL = select(mxL[i], ysL, hi)
      x = locInd(mxR, ysR, vsL, hi)
      mx[i] = x < 0
        ? vsL.concat(mxL2[i], init(wR, fillEmpty))
        : vsL.concat(mxL2[i], mxR2[x])
    }
    return mx
  }

  static joinRight = ({ mx: mxL, ys: ysL }, { mx: mxR, ys: ysR }, fillEmpty) => {
    const
      hR = mxR.length, hi = ysR.length,
      mx = Array(hR),
      mxL2 = splicesColumns(Mx.copy(mxL), ysL.slice().sort(NUM_ASC)), wL = width(mxL2),
      mxR2 = splicesColumns(Mx.copy(mxR), ysR.slice().sort(NUM_ASC))
    for (let i = 0, x, vsR; i < hR; i++) {
      vsR = select(mxR[i], ysR, hi)
      x = locInd(mxL, ysL, vsR, hi)
      mx[i] = x < 0
        ? vsR.concat(init(wL, fillEmpty), mxR2[i])
        : vsR.concat(mxL2[x], mxR2[i])
    }
    return mx
  }

  static joinIntersect = ({ mx: mxL, ys: ysL }, { mx: mxR, ys: ysR }) => {
    const
      hL = mxL.length, hi = ysL.length,
      mx = [],
      mxL2 = splicesColumns(Mx.copy(mxL), ysL.slice().sort(NUM_ASC)),
      mxR2 = splicesColumns(Mx.copy(mxR), ysR.slice().sort(NUM_ASC))
    for (let i = 0, x, vsL; i < hL; i++) {
      vsL = select(mxL[i], ysL, hi)
      x = locInd(mxR, ysR, vsL, hi)
      if (x < 0) continue
      mx.push(vsL.concat(mxL2[i], mxR2[x]))
    }
    return mx
  }
}



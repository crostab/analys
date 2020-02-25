'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var comparer = require('@aryth/comparer');
var vectorSelect = require('@vect/vector-select');
var vectorUpdate = require('@vect/vector-update');
var table = require('@analys/table');
var vectorInit = require('@vect/vector-init');
var columnsUpdate = require('@vect/columns-update');
var matrixSize = require('@vect/matrix-size');
var veho = require('veho');

const INTERSECT = -1;
const UNION = 0;
const LEFT = 1;
const RIGHT = 2;
const JoinTypes = {
  intersect: INTERSECT,
  union: UNION,
  left: LEFT,
  right: RIGHT
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const locInd = (mx, ys, vs, hi) => mx.findIndex(row => {
  for (let i = 0; i < hi; i++) if (row[ys[i]] !== vs[i]) return false;

  return true;
});
/**
 *
 * @param joinType
 * @returns {
 * (function({mx: *[][], ys: number[]}, {mx: *[][], ys: number[]}): *[][])
 * |(function({mx: *[][], ys: number[]}, {mx: *[][], ys: number[]}, *=): *[][])
 * }
 */


const Joiner = joinType => {
  switch (joinType) {
    case JoinTypes.union:
      return MatrixJoiner.joinUnion;

    case JoinTypes.left:
      return MatrixJoiner.joinLeft;

    case JoinTypes.right:
      return MatrixJoiner.joinRight;

    case JoinTypes.intersect:
    default:
      return MatrixJoiner.joinIntersect;
  }
};

class MatrixJoiner {}

_defineProperty(MatrixJoiner, "joinUnion", ({
  mx: mxL,
  ys: ysL
}, {
  mx: mxR,
  ys: ysR
}, fillEmpty) => {
  const hL = mxL.length,
        hR = mxR.length,
        hi = ysR.length,
        mx = Array(hL),
        mxL2 = columnsUpdate.splices(veho.Mx.copy(mxL), ysL.slice().sort(comparer.NUM_ASC)),
        wL = matrixSize.width(mxL2),
        mxR2 = columnsUpdate.splices(veho.Mx.copy(mxR), ysR.slice().sort(comparer.NUM_ASC)),
        wR = matrixSize.width(mxR2),
        idxRiLs = new Set();

  for (let i = 0, x, vsL; i < hL; i++) {
    vsL = vectorSelect.select(mxL[i], ysL, hi);
    x = locInd(mxR, ysR, vsL, hi);

    if (x < 0) {
      mx[i] = vsL.concat(mxL2[i], vectorInit.init(wR, fillEmpty));
    } else {
      mx[i] = vsL.concat(mxL2[i], mxR2[x]);
      idxRiLs.add(x);
    }
  }

  for (let i = 0, x, vsR; i < hR; i++) {
    var _vsR$concat;

    if (idxRiLs.has(i)) {
      continue;
    }

    vsR = vectorSelect.select(mxR[i], ysR, hi);
    x = locInd(mxL, ysL, vsR, hi);
    if (x < 0) _vsR$concat = vsR.concat(vectorInit.init(wL, fillEmpty), mxR2[i]), mx.push(_vsR$concat);
  }

  return mx;
});

_defineProperty(MatrixJoiner, "joinLeft", ({
  mx: mxL,
  ys: ysL
}, {
  mx: mxR,
  ys: ysR
}, fillEmpty) => {
  const hL = mxL.length,
        hi = ysL.length,
        mx = Array(hL),
        mxL2 = columnsUpdate.splices(veho.Mx.copy(mxL), ysL.slice().sort(comparer.NUM_ASC)),
        mxR2 = columnsUpdate.splices(veho.Mx.copy(mxR), ysR.slice().sort(comparer.NUM_ASC)),
        wR = matrixSize.width(mxR2);

  for (let i = 0, x, vsL; i < hL; i++) {
    vsL = vectorSelect.select(mxL[i], ysL, hi);
    x = locInd(mxR, ysR, vsL, hi);
    mx[i] = x < 0 ? vsL.concat(mxL2[i], vectorInit.init(wR, fillEmpty)) : vsL.concat(mxL2[i], mxR2[x]);
  }

  return mx;
});

_defineProperty(MatrixJoiner, "joinRight", ({
  mx: mxL,
  ys: ysL
}, {
  mx: mxR,
  ys: ysR
}, fillEmpty) => {
  const hR = mxR.length,
        hi = ysR.length,
        mx = Array(hR),
        mxL2 = columnsUpdate.splices(veho.Mx.copy(mxL), ysL.slice().sort(comparer.NUM_ASC)),
        wL = matrixSize.width(mxL2),
        mxR2 = columnsUpdate.splices(veho.Mx.copy(mxR), ysR.slice().sort(comparer.NUM_ASC));

  for (let i = 0, x, vsR; i < hR; i++) {
    vsR = vectorSelect.select(mxR[i], ysR, hi);
    x = locInd(mxL, ysL, vsR, hi);
    mx[i] = x < 0 ? vsR.concat(vectorInit.init(wL, fillEmpty), mxR2[i]) : vsR.concat(mxL2[x], mxR2[i]);
  }

  return mx;
});

_defineProperty(MatrixJoiner, "joinIntersect", ({
  mx: mxL,
  ys: ysL
}, {
  mx: mxR,
  ys: ysR
}) => {
  const hL = mxL.length,
        hi = ysL.length,
        mx = [],
        mxL2 = columnsUpdate.splices(veho.Mx.copy(mxL), ysL.slice().sort(comparer.NUM_ASC)),
        mxR2 = columnsUpdate.splices(veho.Mx.copy(mxR), ysR.slice().sort(comparer.NUM_ASC));

  for (let i = 0, x, vsL; i < hL; i++) {
    vsL = vectorSelect.select(mxL[i], ysL, hi);
    x = locInd(mxR, ysR, vsL, hi);
    if (x < 0) continue;
    mx.push(vsL.concat(mxL2[i], mxR2[x]));
  }

  return mx;
});

class TableJoin {
  /**
   *
   * @param {Table} tbL
   * @param {Table} tbR
   * @param {string[]|number[]} fields
   * @param {number} [joinType=-1] - union:0,left:1,right:2,intersect:-1
   * @param {*} [fillEmpty]
   * @returns {Table}
   */
  static join(tbL, tbR, fields, joinType = INTERSECT, fillEmpty = null) {
    const ysL = fields.map(x => tbL.coin(x)),
          ysR = fields.map(x => tbR.coin(x)),
          joiner = Joiner(joinType);
    const ys = ysL.slice().sort(comparer.NUM_ASC);
    const head = vectorSelect.select(tbL.head, ysL).concat(vectorUpdate.splices(tbL.head.slice(), ys), vectorUpdate.splices(tbR.head.slice(), ys));
    const rows = joiner({
      mx: tbL.rows,
      ys: ysL
    }, {
      mx: tbR.rows,
      ys: ysR
    }, fillEmpty);
    return new table.Table(head, rows, `${tbL.title} ${tbR.title}`);
  }

}

exports.INTERSECT = INTERSECT;
exports.JoinTypes = JoinTypes;
exports.LEFT = LEFT;
exports.RIGHT = RIGHT;
exports.TableJoin = TableJoin;
exports.UNION = UNION;

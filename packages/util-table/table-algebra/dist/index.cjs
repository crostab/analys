'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumJoinModes = require('@analys/enum-join-modes');
var comparer = require('@aryth/comparer');
var vectorSelect = require('@vect/vector-select');
var vectorUpdate = require('@vect/vector-update');
var vectorInit = require('@vect/vector-init');
var vectorMapper = require('@vect/vector-mapper');

const selectKeyedVector = function (vec) {
  let {
    indexes,
    asc,
    depth
  } = this; // depth = depth || indexes.length, asc = asc || indexes.sort(NUM_ASC)

  return depth === 1 ? {
    key: [vec[indexes[0]]],
    vector: (vec.splice(indexes[0], 1), vec)
  } : {
    key: vectorSelect.select(vec, indexes, depth),
    vector: vectorUpdate.splices(vec, asc, depth)
  };
};

const lookupKeyedVector = function (lookupKey) {
  var _this$find;

  return (_this$find = this.find(({
    key
  }) => key.every((x, i) => x === lookupKey[i]))) === null || _this$find === void 0 ? void 0 : _this$find.vector;
};
const lookupKeyedVectorIndex = function (lookupKey) {
  return this.findIndex(({
    key
  }) => key.every((x, i) => x === lookupKey[i]));
};

/**
 * @param joinType
 * @returns {function(MultiKeyedVector[], MultiKeyedVector[], number?):*[][]}
 */

const Joiner = joinType => {
  if (joinType === enumJoinModes.UNION) {
    return joinUnion;
  }

  if (joinType === enumJoinModes.LEFT) {
    return joinLeft;
  }

  if (joinType === enumJoinModes.RIGHT) {
    return joinRight;
  }

  if (joinType === enumJoinModes.INTERSECT) {
    return joinIntersect;
  }

  return joinIntersect;
};
/** @typedef {{keyIndex:*[],vector:*[]}} MultiKeyedVector */

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @returns {*[][]}
 */

const joinIntersect = (L, R) => {
  const rows = [];
  vectorMapper.iterate(L, ({
    key,
    vector
  }) => {
    let another = lookupKeyedVector.call(R, key);
    if (another) rows.push(key.concat(vector, another));
  });
  return rows;
};
/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */


const joinUnion = (L, R, n) => {
  var _L$, _L$$vector, _R$, _R$$vector;

  const leftL = L.length,
        rows = Array(leftL),
        joinedIndexes = new Set(),
        wL = (_L$ = L[0]) === null || _L$ === void 0 ? void 0 : (_L$$vector = _L$.vector) === null || _L$$vector === void 0 ? void 0 : _L$$vector.length,
        wR = (_R$ = R[0]) === null || _R$ === void 0 ? void 0 : (_R$$vector = _R$.vector) === null || _R$$vector === void 0 ? void 0 : _R$$vector.length;
  vectorMapper.iterate(L, ({
    key,
    vector
  }, i) => {
    let j = lookupKeyedVectorIndex.call(R, key);
    rows[i] = j >= 0 && joinedIndexes.add(j) ? key.concat(vector, R[j].vector) : key.concat(vector, vectorInit.iso(wR, n));
  });
  vectorMapper.iterate(R, ({
    key,
    vector
  }, j) => !joinedIndexes.has(j) ? rows.push(key.concat(vectorInit.iso(wL, n), vector)) : void 0);
  return rows;
};
/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */


const joinLeft = (L, R, n) => {
  var _R$2, _R$2$vector;

  let rows = Array(L.length),
      w = (_R$2 = R[0]) === null || _R$2 === void 0 ? void 0 : (_R$2$vector = _R$2.vector) === null || _R$2$vector === void 0 ? void 0 : _R$2$vector.length,
      another;
  vectorMapper.iterate(L, ({
    key,
    vector
  }, i) => rows[i] = (another = lookupKeyedVector.call(R, key)) ? key.concat(vector, another) : key.concat(vector, vectorInit.iso(w, n)));
  return rows;
};
/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */


const joinRight = (L, R, n) => {
  var _L$2, _L$2$vector;

  let rows = Array(R.length),
      w = (_L$2 = L[0]) === null || _L$2 === void 0 ? void 0 : (_L$2$vector = _L$2.vector) === null || _L$2$vector === void 0 ? void 0 : _L$2$vector.length,
      another;
  vectorMapper.iterate(R, ({
    key,
    vector
  }, i) => rows[i] = (another = lookupKeyedVector.call(L, key)) ? key.concat(another, vector) : key.concat(vectorInit.iso(w, n), vector));
  return rows;
};

/**
 *
 * @param {Table|TableObject} tableL
 * @param {Table|TableObject} tableR
 * @param {str[]} fields
 * @param {number} [joinType=-1] - union:0,left:1,right:2,intersect:-1
 * @param {*} [fillEmpty]
 * @returns {Table|TableObject}
 */

function tableJoin(tableL, tableR, fields, joinType = enumJoinModes.INTERSECT, fillEmpty = null) {
  var _tableL$head, _tableL$rows, _tableR$head, _tableR$rows;

  if (!(tableL !== null && tableL !== void 0 && (_tableL$head = tableL.head) !== null && _tableL$head !== void 0 && _tableL$head.length) || !(tableL !== null && tableL !== void 0 && (_tableL$rows = tableL.rows) !== null && _tableL$rows !== void 0 && _tableL$rows.length)) return tableR;
  if (!(tableR !== null && tableR !== void 0 && (_tableR$head = tableR.head) !== null && _tableR$head !== void 0 && _tableR$head.length) || !(tableR !== null && tableR !== void 0 && (_tableR$rows = tableR.rows) !== null && _tableR$rows !== void 0 && _tableR$rows.length)) return tableL;
  const joiner = Joiner(joinType),
        depth = fields.length,
        indL = fields.map(x => tableL.head.indexOf(x)),
        indR = fields.map(x => tableR.head.indexOf(x)),
        ascL = indL.slice().sort(comparer.NUM_ASC),
        ascR = indR.slice().sort(comparer.NUM_ASC),
        keyVecL = selectKeyedVector.bind({
    indexes: indL,
    asc: ascL,
    depth
  }),
        keyVecR = selectKeyedVector.bind({
    indexes: indR,
    asc: ascR,
    depth
  });
  const head = vectorSelect.select(tableL.head, indL).concat(vectorUpdate.splices(tableL.head.slice(), ascL), vectorUpdate.splices(tableR.head.slice(), ascR));
  const nextL = tableL.rows.map(row => keyVecL(row === null || row === void 0 ? void 0 : row.slice())),
        nextR = tableR.rows.map(row => keyVecR(row === null || row === void 0 ? void 0 : row.slice()));
  const rows = joiner(nextL, nextR, fillEmpty);
  return {
    head,
    rows,
    title: `${tableL.title} ${tableR.title}`
  };
} // xr().fields(fields)['leftIndexes'](ascL)['rightIndexes'](ascR) |> logger
// xr().head(head |> deco) |> logger

function merge(...tables) {
  const {
    fields,
    joinType,
    fillEmpty
  } = this;
  const n = tables.length;
  if (n === 0) return null;
  if (n === 1) return tables[0];
  if (n === 2) return tableJoin(tables[0], tables[1], fields, joinType, fillEmpty);
  return tables.reduce((accum, next) => tableJoin(accum, next, fields, joinType, fillEmpty));
}

exports.merge = merge;
exports.tableJoin = tableJoin;

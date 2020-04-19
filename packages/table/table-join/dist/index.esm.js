import { UNION, LEFT, RIGHT, INTERSECT } from '@analys/enum-join-modes';
import { NUM_ASC } from '@aryth/comparer';
import { select } from '@vect/vector-select';
import { splices } from '@vect/vector-update';
import { iso } from '@vect/vector-init';
import { iterate } from '@vect/vector-mapper';

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
    key: select(vec, indexes, depth),
    vector: splices(vec, asc, depth)
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
  if (joinType === UNION) {
    return joinUnion;
  }

  if (joinType === LEFT) {
    return joinLeft;
  }

  if (joinType === RIGHT) {
    return joinRight;
  }

  if (joinType === INTERSECT) {
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
  iterate(L, ({
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
  const leftL = L.length,
        rows = Array(leftL),
        joinedIndexes = new Set(),
        wL = L[0].vector.length,
        wR = R[0].vector.length;
  iterate(L, ({
    key,
    vector
  }, i) => {
    let j = lookupKeyedVectorIndex.call(R, key);
    rows[i] = j >= 0 && joinedIndexes.add(j) ? key.concat(vector, R[j].vector) : key.concat(vector, iso(wR, n));
  });
  iterate(R, ({
    key,
    vector
  }, j) => !joinedIndexes.has(j) ? rows.push(key.concat(iso(wL, n), vector)) : void 0);
  return rows;
};
/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */


const joinLeft = (L, R, n) => {
  let rows = Array(L.length),
      w = R[0].vector.length,
      another;
  iterate(L, ({
    key,
    vector
  }, i) => rows[i] = (another = lookupKeyedVector.call(R, key)) ? key.concat(vector, another) : key.concat(vector, iso(w, n)));
  return rows;
};
/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */


const joinRight = (L, R, n) => {
  let rows = Array(R.length),
      w = L[0].vector.length,
      another;
  iterate(R, ({
    key,
    vector
  }, i) => rows[i] = (another = lookupKeyedVector.call(L, key)) ? key.concat(another, vector) : key.concat(iso(w, n), vector));
  return rows;
};

/**
 *
 * @param {Table|TableObject} tableL
 * @param {Table|TableObject} tableR
 * @param {str[]} fields
 * @param {number} [joinType=-1] - union:0,left:1,right:2,intersect:-1
 * @param {*} [fillEmpty]
 * @returns {TableObject}
 */

function tableJoin(tableL, tableR, fields, joinType = INTERSECT, fillEmpty = null) {
  let joiner = Joiner(joinType),
      depth = fields.length,
      indexesL = fields.map(x => tableL.head.indexOf(x)),
      ascL = indexesL.slice().sort(NUM_ASC),
      indexesR = fields.map(x => tableR.head.indexOf(x)),
      ascR = indexesR.slice().sort(NUM_ASC),
      toKVL = selectKeyedVector.bind({
    indexes: indexesL,
    asc: ascL,
    depth
  }),
      toKVR = selectKeyedVector.bind({
    indexes: indexesR,
    asc: ascR,
    depth
  });
  const head = select(tableL.head, indexesL).concat(splices(tableL.head.slice(), ascL), splices(tableR.head.slice(), ascR));
  const L = tableL.rows.map(row => toKVL(row.slice())),
        R = tableR.rows.map(row => toKVR(row.slice()));
  const rows = joiner(L, R, fillEmpty);
  return {
    head,
    rows,
    title: `${tableL.title} ${tableR.title}`
  };
} // xr().fields(fields)['leftIndexes'](ascL)['rightIndexes'](ascR) |> logger
// xr().head(head |> deco) |> logger

export { tableJoin };

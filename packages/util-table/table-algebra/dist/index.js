import { UNION, LEFT, RIGHT, INTERSECT } from '@analys/enum-join-modes';
import { NUM_ASC } from '@aryth/comparer';
import { select, divide } from '@vect/vector-select';
import { splices } from '@vect/vector-update';
import { iso } from '@vect/vector-init';
import { iterate, mapper } from '@vect/vector-mapper';
import { divide as divide$1 } from '@vect/columns-select';
import { slice } from '@analys/table-init';
import { acquire, merge as merge$1 } from '@vect/vector-algebra';
import { mutazip, zipper } from '@vect/vector-zipper';

const selectKeyedVector = function (vec) {
  let { indexes, asc, depth } = this;
  // depth = depth || indexes.length, asc = asc || indexes.sort(NUM_ASC)
  return depth === 1
    ? {
      key: [vec[indexes[0]]],
      vector: (vec.splice(indexes[0], 1), vec)
    }
    : {
      key: select(vec, indexes, depth),
      vector: splices(vec, asc, depth)
    }
};

const lookupKeyedVector = function (lookupKey) {
  return this.find(({ key }) => key.every((x, i) => x === lookupKey[i]))?.vector
};

const lookupKeyedVectorIndex = function (lookupKey) {
  return this.findIndex(({ key }) => key.every((x, i) => x === lookupKey[i]))
};

/**
 * @param joinType
 * @returns {function(MultiKeyedVector[], MultiKeyedVector[], number?):*[][]}
 */
const Joiner = (joinType) => {
  if (joinType === UNION) { return joinUnion }
  if (joinType === LEFT) { return joinLeft }
  if (joinType === RIGHT) { return joinRight }
  if (joinType === INTERSECT) { return joinIntersect }
  return joinIntersect
};

/** @typedef {{keyIndex:*[],vector:*[]}} MultiKeyedVector */

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @returns {*[][]}
 */
const joinIntersect = (L, R) => {
  const rows = [];
  iterate(L,
    ({ key, vector }) => {
      let another = lookupKeyedVector.call(R, key);
      if (another) rows.push(key.concat(vector, another));
    });
  return rows
};

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinUnion = (L, R, n) => {
  const leftL = L.length, rows = Array(leftL), joinedIndexes = new Set(),
    wL = L[0]?.vector?.length, wR = R[0]?.vector?.length;
  iterate(L,
    ({ key, vector }, i) => {
      let j = lookupKeyedVectorIndex.call(R, key);
      rows[i] = j >= 0 && joinedIndexes.add(j)
        ? key.concat(vector, R[j].vector)
        : key.concat(vector, iso(wR, n));
    });
  iterate(R,
    ({ key, vector }, j) =>
      !joinedIndexes.has(j)
        ? rows.push(key.concat(iso(wL, n), vector))
        : void 0
  );
  return rows
};

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinLeft = (L, R, n) => {
  let rows = Array(L.length), w = R[0]?.vector?.length, another;
  iterate(L,
    ({ key, vector }, i) =>
      rows[i] = (another = lookupKeyedVector.call(R, key))
        ? key.concat(vector, another)
        : key.concat(vector, iso(w, n))
  );
  return rows
};

/**
 * @param {MultiKeyedVector[]} L
 * @param {MultiKeyedVector[]} R
 * @param {*} [n]
 * @returns {*[][]}
 */
const joinRight = (L, R, n) => {
  let rows = Array(R.length), w = L[0]?.vector?.length, another;
  iterate(R,
    ({ key, vector }, i) =>
      rows[i] = (another = lookupKeyedVector.call(L, key))
        ? key.concat(another, vector)
        : key.concat(iso(w, n), vector)
  );
  return rows
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
function tableJoin(
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
    keyVecR = selectKeyedVector.bind({ indexes: indR, asc: ascR, depth });
  const head = select(tableL.head, indL).concat(splices(tableL.head.slice(), ascL), splices(tableR.head.slice(), ascR));
  const
    nextL = tableL.rows.map(row => keyVecL(row?.slice())),
    nextR = tableR.rows.map(row => keyVecR(row?.slice()));
  const rows = joiner(nextL, nextR, fillEmpty);
  return { head, rows, title: `${tableL.title} ${tableR.title}` }
}


// xr().fields(fields)['leftIndexes'](ascL)['rightIndexes'](ascR) |> logger
// xr().head(head |> deco) |> logger

/**
 * Divide a util-table by fields
 * @param {*[]} fields
 * @return {{ pick:TableObject, rest:TableObject }} - mutated 'this' {head, rows}
 */
const tableDivide = function (fields) {
  /** @type {Table|TableObject} */ const rs = slice(this);
  /** @type {Table|TableObject} */ const pk = slice(this);
  const { head, rows } = this;
  const indexes = mapper(fields, label => head.indexOf(label)).sort(NUM_ASC);
  ({ pick: pk.head, rest: rs.head } = divide(head, indexes));
  ({ pick: pk.rows, rest: rs.rows } = divide$1(rows, indexes));
  return { pick: pk, rest: rs }
};

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */
const tableAcquire = (ta, tb) => {
  acquire(ta.head, tb.head);
  mutazip(ta.rows, tb.rows, (va, vb) => acquire(va, vb));
  return ta
};

/**
 *
 * @param {Object|Table} ta
 * @param {Object|Table} tb
 * @returns {Object|Table}
 */
const tableMerge = (ta, tb) => {
  const head = merge$1(ta.head, tb.head);
  const rows = zipper(ta.rows, tb.rows, (va, vb) => merge$1(va, vb));
  return ta.copy ? ta.copy({ head, rows }) : { head, rows }
};

function merge(...tables) {
  const { fields, joinType, fillEmpty } = this;
  const n = tables.length;
  if (n === 0) return null
  if (n === 1) return tables[0]
  if (n === 2) return tableJoin(tables[0], tables[1], fields, joinType, fillEmpty)
  return tables.reduce((accum, next) => tableJoin(accum, next, fields, joinType, fillEmpty))
}

export { Joiner, merge, tableAcquire, tableDivide, tableJoin, tableMerge };

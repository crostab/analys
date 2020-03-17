'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorInit = require('@vect/vector-init');
var vectorMapper = require('@vect/vector-mapper');
var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorZipper = require('@vect/vector-zipper');

const arid = function (x) {
  let i = this.s.indexOf(x);
  if (i >= 0) return i;
  return i + (this.m.push(vectorInit.init(this.b.length, this.n)), this.s.push(x));
};
const acid = function (y) {
  let j = this.b.indexOf(y);
  if (j >= 0) return j;
  return j + (vectorMapper.mapper(this.m, row => row.push(this.n()), this.s.length), this.b.push(y));
};
const expand = function (x, y) {
  arid.call(this, x), acid.call(this, y);
};

const skeleton = ({
  s = [],
  b = [],
  m = [],
  n
} = {}) => ({
  s,
  b,
  m,
  n
});
const increSkeleton = () => skeleton({
  n: () => 0
});
const accumSkeleton = () => skeleton({
  n: () => []
});
const cubicSkeleton = band => {
  const nvs = vacancyCreators(band);

  const n = () => vectorMapper.mapper(nvs, nv => nv());

  return skeleton({
    n
  });
};

const vacancyCreators = band => band.map(({
  mode
}) => mode === enumPivotMode.ACCUM ? () => [] : () => 0);

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {*[]} keys
 * @param {*[][]} vectors
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {[*[], *[][]]}
 */

const sortKeyedVectors = (keys, vectors, comparer, index) => {
  const keyComparer = (a, b) => comparer(a[0], b[0]);

  const newKeys = Array(keys.length);
  const newVectors = index >= 0 ? vectorZipper.zipper(keys, vectors, (key, vector) => [vector[index], key, vector]).sort(keyComparer).map(([, k, r], i) => (newKeys[i] = k, r)) : vectorZipper.zipper(keys, vectors, (key, vector) => [key, vector]).sort(keyComparer).map(([k, r], i) => (newKeys[i] = k, r));
  return [newKeys, newVectors];
};

exports.accumSkeleton = accumSkeleton;
exports.acid = acid;
exports.arid = arid;
exports.cubicSkeleton = cubicSkeleton;
exports.expand = expand;
exports.increSkeleton = increSkeleton;
exports.skeleton = skeleton;
exports.sortKeyedVectors = sortKeyedVectors;

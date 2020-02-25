import { init } from '@vect/vector-init';
import { mapper } from '@vect/vector-mapper';
import { ACCUM } from '@analys/enum-pivot-mode';
import { zipper } from '@vect/vector-zipper';

const arid = function (x) {
  let i = this.s.indexOf(x);
  if (i >= 0) return i;
  return i + (this.m.push(init(this.b.length, this.n)), this.s.push(x));
};
const acid = function (y) {
  let j = this.b.indexOf(y);
  if (j >= 0) return j;
  return j + (mapper(this.m, row => row.push(this.n()), this.s.length), this.b.push(y));
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

  const n = () => mapper(nvs, nv => nv());

  return skeleton({
    n
  });
};

const vacancyCreators = band => band.map(({
  mode
}) => mode === ACCUM ? () => [] : () => 0);

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
  const newVectors = index >= 0 ? zipper(keys, vectors, (key, vector) => [vector[index], key, vector]).sort(keyComparer).map(([, k, r], i) => (newKeys[i] = k, r)) : zipper(keys, vectors, (key, vector) => [key, vector]).sort(keyComparer).map(([k, r], i) => (newKeys[i] = k, r));
  return [newKeys, newVectors];
};

export { accumSkeleton, acid, arid, cubicSkeleton, expand, increSkeleton, skeleton, sortKeyedVectors };

import { init } from '@vect/vector-init';
import { max, min } from '@aryth/comparer';
import { FUN } from '@typen/enum-data-types';
import { nullish } from '@typen/nullish';
import { acquire }                                                    from '@vect/vector-algebra';
import { MERGE, ACCUM, INCRE, COUNT, AVERAGE, MAX, MIN, FIRST, LAST } from '@analys/enum-pivot-mode';

const ampliCell = function (side, banner) {
  return this.rows[arid.call(this, side)][acid.call(this, banner)];
};
const arid = function (x) {
  const ri = this.side.indexOf(x);
  if (ri >= 0) return ri;
  return this.rows.push(init(this.head.length, this.init)), ri + this.side.push(x);
};
const acid = function (y) {
  const ci = this.head.indexOf(y);
  if (ci >= 0) return ci;
  return this.rows.forEach(r => r.push(this.init())), ci + this.head.push(y);
};

const queryCell = function (x, y) {
  return (x = qrid.call(this, x)) >= 0 && (y = qcid.call(this, y)) >= 0 ? this.rows[x][y] : void 0;
};
const qrid = function (x) {
  return this.side.indexOf(x);
};
const qcid = function (y) {
  return this.head.indexOf(y);
};

const NaiveAccumulators = {
  merge: (target, value) => acquire(target, value),
  accum: (target, value) => (target.push(value), target),
  incre: (target, value) => target + value,
  count: (target, value) => target + 1,
  average: (target, value) => (target.sum += value, target.count += 1, target),
  max: (target, value) => max(target, value),
  min: (target, value) => min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target
};
const Accumulators = {
  merge: (target, value) => nullish(value) ? target : acquire(target, value),
  accum: (target, value) => nullish(value) ? target : (target.push(value), target),
  incre: (target, value) => nullish(value) ? target : target + value,
  count: (target, value) => nullish(value) ? target : target + 1,
  average: (target, value) => nullish(value) ? target : (target.sum += value, target.count += 1, target),
  max: (target, value) => nullish(value) ? target : max(target, value),
  min: (target, value) => nullish(value) ? target : min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target
};
const modeToTally = mode => {
  let accumulators = Accumulators;

  if (Array.isArray(mode)) {
    accumulators = mode[1] ?? Accumulators;
    mode = mode[0];
  }

  if (typeof mode === FUN) return mode;
  if (mode in accumulators) return accumulators[mode];
  return () => {};
};

const modeToInit = mode => {
  if (Array.isArray(mode)) mode = mode[0];
  if (mode === MERGE || mode === ACCUM) return () => [];
  if (mode === INCRE || mode === COUNT) return () => 0;
  if (mode === AVERAGE) return () => ({
    sum: 0,
    count: 0,

    get value() {
      return this.sum / this.count;
    }

  });
  if (mode === MAX) return () => Number.NEGATIVE_INFINITY;
  if (mode === MIN) return () => Number.POSITIVE_INFINITY;
  if (mode === FIRST || mode === LAST) return () => void 0;
  return () => 0;
};

export { Accumulators, NaiveAccumulators, acid, ampliCell, arid, modeToInit, modeToTally, qcid, qrid, queryCell };

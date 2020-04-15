import { init } from '@vect/vector-init';
import { MERGE, ACCUM, INCRE, COUNT, MAX, MIN, AVERAGE } from '@analys/enum-pivot-mode';
import { max, min } from '@aryth/comparer';
import { acquire } from '@vect/merge-acquire';

const ampliCell = function (side, banner) {
  return this.m[arid.call(this, side)][acid.call(this, banner)];
};
const arid = function (x) {
  const ri = this.s.indexOf(x);
  if (ri >= 0) return ri;
  return this.m.push(init(this.b.length, this.n)), ri + this.s.push(x);
};
const acid = function (y) {
  const ci = this.b.indexOf(y);
  if (ci >= 0) return ci;
  return this.m.forEach(r => r.push(this.n())), ci + this.b.push(y);
};

const queryCell = function (x, y) {
  return (x = qrid.call(this, x)) >= 0 && (y = qcid.call(this, y)) >= 0 ? this.m[x][y] : void 0;
};
const qrid = function (x) {
  return this.s.indexOf(x);
};
const qcid = function (y) {
  return this.b.indexOf(y);
};

const tallyMerge = (target, value) => acquire(target, value);
const tallyAccum = (target, value) => (target.push(value), target);
const tallyIncre = (target, value) => target + value;
const tallyCount = target => target + 1;
const tallyMax = (target, value) => max(target, value);
const tallyMin = (target, value) => min(target, value);
const modeToTally = mode => {
  if (mode === MERGE) return tallyMerge;
  if (mode === ACCUM) return tallyAccum;
  if (mode === INCRE) return tallyIncre;
  if (mode === COUNT) return tallyCount;
  if (mode === MAX) return tallyMax;
  if (mode === MIN) return tallyMin;
  return () => {};
};

const modeToInit = mode => {
  if (mode === MERGE || mode === ACCUM) return () => [];
  if (mode === INCRE || mode === COUNT || mode === AVERAGE) return () => 0;
  if (mode === MAX) return () => Number.NEGATIVE_INFINITY;
  if (mode === MIN) return () => Number.POSITIVE_INFINITY;
  return () => [];
};

export { acid, ampliCell, arid, modeToInit, modeToTally, qcid, qrid, queryCell, tallyAccum, tallyCount, tallyIncre, tallyMax, tallyMerge, tallyMin };

import { init } from '@vect/vector-init';
import { MERGE, ACCUM, INCRE, COUNT } from '@analys/enum-pivot-mode';

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

// export default Function.prototype.apply.bind(Array.prototype.push)
const acquire = (va, vb) => (Array.prototype.push.apply(va, vb), va); // export default Function.prototype.call.bind(Array.prototype.concat)

const tallyMerge = (target, value) => acquire(target, value);
const tallyAccum = (target, value) => (target.push(value), target);
const tallyIncre = (target, value) => target + value;
const tallyCount = target => target + 1;
const Accrual = mode => {
  if (mode === MERGE) return tallyMerge;
  if (mode === ACCUM) return tallyAccum;
  if (mode === INCRE) return tallyIncre;
  if (mode === COUNT) return tallyCount;
  return () => {};
};

export { Accrual, acid, ampliCell, arid, tallyAccum, tallyCount, tallyIncre, tallyMerge };

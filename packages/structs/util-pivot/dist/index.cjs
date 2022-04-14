'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorInit = require('@vect/vector-init');
var comparer = require('@aryth/comparer');
var enumDataTypes = require('@typen/enum-data-types');
var nullish = require('@typen/nullish');
var vectorMerge = require('@vect/vector-merge');
var enumPivotMode = require('@analys/enum-pivot-mode');

const ampliCell = function (side, banner) {
  return this.rows[arid.call(this, side)][acid.call(this, banner)];
};
const arid = function (x) {
  const ri = this.side.indexOf(x);
  if (ri >= 0) return ri;
  return this.rows.push(vectorInit.init(this.head.length, this.init)), ri + this.side.push(x);
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
  merge: (target, value) => vectorMerge.acquire(target, value),
  accum: (target, value) => (target.push(value), target),
  incre: (target, value) => target + value,
  count: (target, value) => target + 1,
  average: (target, value) => (target.sum += value, target.count += 1, target),
  max: (target, value) => comparer.max(target, value),
  min: (target, value) => comparer.min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target
};
const Accumulators = {
  merge: (target, value) => nullish.nullish(value) ? target : vectorMerge.acquire(target, value),
  accum: (target, value) => nullish.nullish(value) ? target : (target.push(value), target),
  incre: (target, value) => nullish.nullish(value) ? target : target + value,
  count: (target, value) => nullish.nullish(value) ? target : target + 1,
  average: (target, value) => nullish.nullish(value) ? target : (target.sum += value, target.count += 1, target),
  max: (target, value) => nullish.nullish(value) ? target : comparer.max(target, value),
  min: (target, value) => nullish.nullish(value) ? target : comparer.min(target, value),
  first: (target, value) => target ?? value,
  last: (target, value) => value ?? target
};
const modeToTally = mode => {
  let accumulators = Accumulators;

  if (Array.isArray(mode)) {
    accumulators = mode[1] ?? Accumulators;
    mode = mode[0];
  }

  if (typeof mode === enumDataTypes.FUN) return mode;
  if (mode in accumulators) return accumulators[mode];
  return () => {};
};

const modeToInit = mode => {
  if (Array.isArray(mode)) mode = mode[0];
  if (mode === enumPivotMode.MERGE || mode === enumPivotMode.ACCUM) return () => [];
  if (mode === enumPivotMode.INCRE || mode === enumPivotMode.COUNT) return () => 0;
  if (mode === enumPivotMode.AVERAGE) return () => ({
    sum: 0,
    count: 0,

    get value() {
      return this.sum / this.count;
    }

  });
  if (mode === enumPivotMode.MAX) return () => Number.NEGATIVE_INFINITY;
  if (mode === enumPivotMode.MIN) return () => Number.POSITIVE_INFINITY;
  if (mode === enumPivotMode.FIRST || mode === enumPivotMode.LAST) return () => void 0;
  return () => 0;
};

exports.Accumulators = Accumulators;
exports.NaiveAccumulators = NaiveAccumulators;
exports.acid = acid;
exports.ampliCell = ampliCell;
exports.arid = arid;
exports.modeToInit = modeToInit;
exports.modeToTally = modeToTally;
exports.qcid = qcid;
exports.qrid = qrid;
exports.queryCell = queryCell;

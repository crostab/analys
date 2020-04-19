'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorInit = require('@vect/vector-init');
var enumPivotMode = require('@analys/enum-pivot-mode');
var comparer = require('@aryth/comparer');
var vectorMerge = require('@vect/vector-merge');

const ampliCell = function (side, banner) {
  return this.m[arid.call(this, side)][acid.call(this, banner)];
};
const arid = function (x) {
  const ri = this.s.indexOf(x);
  if (ri >= 0) return ri;
  return this.m.push(vectorInit.init(this.b.length, this.n)), ri + this.s.push(x);
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

const tallyMerge = (target, value) => vectorMerge.acquire(target, value);
const tallyAccum = (target, value) => (target.push(value), target);
const tallyIncre = (target, value) => target + value;
const tallyCount = (target, value) => target + 1;
const tallyAverage = (target, value) => (target.s += value, target.n += 1, target);
const tallyMax = (target, value) => comparer.max(target, value);
const tallyMin = (target, value) => comparer.min(target, value);
const tallyFirst = (target, value) => target !== null && target !== void 0 ? target : value;
const tallyLast = (target, value) => value !== null && value !== void 0 ? value : target;
const modeToTally = mode => {
  if (mode === enumPivotMode.MERGE) return tallyMerge;
  if (mode === enumPivotMode.ACCUM) return tallyAccum;
  if (mode === enumPivotMode.INCRE) return tallyIncre;
  if (mode === enumPivotMode.COUNT) return tallyCount;
  if (mode === enumPivotMode.AVERAGE) return tallyAverage;
  if (mode === enumPivotMode.MAX) return tallyMax;
  if (mode === enumPivotMode.MIN) return tallyMin;
  if (mode === enumPivotMode.FIRST) return tallyFirst;
  if (mode === enumPivotMode.LAST) return tallyLast;
  return () => {};
};

const modeToInit = mode => {
  if (mode === enumPivotMode.MERGE || mode === enumPivotMode.ACCUM) return () => [];
  if (mode === enumPivotMode.INCRE || mode === enumPivotMode.COUNT) return () => 0;
  if (mode === enumPivotMode.AVERAGE) return () => ({
    s: 0,
    n: 0,

    get value() {
      return this.s / this.n;
    }

  });
  if (mode === enumPivotMode.MAX) return () => Number.NEGATIVE_INFINITY;
  if (mode === enumPivotMode.MIN) return () => Number.POSITIVE_INFINITY;
  if (mode === enumPivotMode.FIRST || mode === enumPivotMode.LAST) return () => void 0;
  return () => [];
};

exports.acid = acid;
exports.ampliCell = ampliCell;
exports.arid = arid;
exports.modeToInit = modeToInit;
exports.modeToTally = modeToTally;
exports.qcid = qcid;
exports.qrid = qrid;
exports.queryCell = queryCell;
exports.tallyAccum = tallyAccum;
exports.tallyCount = tallyCount;
exports.tallyIncre = tallyIncre;
exports.tallyMax = tallyMax;
exports.tallyMerge = tallyMerge;
exports.tallyMin = tallyMin;

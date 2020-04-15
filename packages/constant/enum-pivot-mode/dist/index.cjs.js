'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const MERGE = -1;
const ACCUM = 0;
const INCRE = 1;
const COUNT = 2;
const AVERAGE = 3;
const MAX = 4;
const MIN = 5;
const FIRST = 6;
const LAST = 7;
const PivotModes = {
  merge: MERGE,
  accum: ACCUM,
  incre: INCRE,
  count: COUNT,
  average: AVERAGE,
  max: MAX,
  min: MIN,
  first: FIRST,
  last: LAST
};

exports.ACCUM = ACCUM;
exports.AVERAGE = AVERAGE;
exports.COUNT = COUNT;
exports.FIRST = FIRST;
exports.INCRE = INCRE;
exports.LAST = LAST;
exports.MAX = MAX;
exports.MERGE = MERGE;
exports.MIN = MIN;
exports.PivotModes = PivotModes;

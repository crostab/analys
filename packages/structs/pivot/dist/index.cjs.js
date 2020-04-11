'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utilPivot = require('@analys/util-pivot');
var enumPivotMode = require('@analys/enum-pivot-mode');

const iterate = function (vec, fn, l) {
  l = l || vec && vec.length;

  for (let i = 0; i < l; i++) fn.call(this, vec[i], i);
};

class Pivot {
  constructor(x, y, z, mode, filter) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.data = {
      s: [],
      b: [],
      m: [],
      n: mode === enumPivotMode.INCRE || mode === enumPivotMode.COUNT ? () => 0 : () => []
    };
    this.updater = Updater(this.data, mode);
    this.filter = filter;
  }

  static build(x, y, z, mode, filter) {
    return new Pivot(x, y, z, mode, filter);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    this.updater(sample[this.x], sample[this.y], sample[this.z]);
  }

  toObject() {
    return {
      side: this.data.s,
      head: this.data.b,
      rows: this.data.m
    };
  }

}
const Updater = function (data, mode) {
  const ri = utilPivot.arid.bind(data),
        ci = utilPivot.acid.bind(data);
  if (mode === enumPivotMode.MERGE) return function (x, y, value) {
    return utilPivot.tallyMerge(data.m[ri(x)][ci(y)], value);
  };
  if (mode === enumPivotMode.ACCUM) return function (x, y, value) {
    return utilPivot.tallyIncre(data.m[ri(x)][ci(y)], value);
  };
  if (mode === enumPivotMode.INCRE) return function (x, y, value) {
    return data.m[ri(x)][ci(y)] += value;
  };
  if (mode === enumPivotMode.COUNT) return function (x, y) {
    return data.m[ri(x)][ci(y)]++;
  };
  return utilPivot.ampliCell.bind(data);
};

exports.Pivot = Pivot;

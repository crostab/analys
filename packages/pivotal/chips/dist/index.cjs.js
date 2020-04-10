'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var utilPivot = require('@analys/util-pivot');
var vectorMapper = require('@vect/vector-mapper');

class Chips {
  constructor(key, field, mode, filter) {
    this.key = key;
    this.data = {};
    this.field = field;
    this.updater = Updater(this.data, mode);
    this.filter = filter;
  }

  static build(kei, field, mode) {
    return new Chips(kei, field, mode);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    this.updater(sample[this.key], sample[this.field]);
  }

  toJson() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data);
  }

}
const Updater = (data, mode) => {
  if (mode === enumPivotMode.MERGE) return function (k, v) {
    if (k in this) {
      utilPivot.tallyMerge(this[k], v);
    } else {
      this[k] = v.slice();
    }
  }.bind(data);
  if (mode === enumPivotMode.ACCUM) return function (k, x) {
    if (k in this) {
      utilPivot.tallyAccum(this[k], x);
    } else {
      this[k] = [x];
    }
  }.bind(data);
  if (mode === enumPivotMode.INCRE) return function (k, n) {
    if (k in this) {
      this[k] += n;
    } else {
      this[k] = n;
    }
  }.bind(data);
  if (mode === enumPivotMode.COUNT) return function (k) {
    if (k in this) {
      this[k]++;
    } else {
      this[k] = 1;
    }
  }.bind(data);
  return () => {};
};

exports.Chips = Chips;

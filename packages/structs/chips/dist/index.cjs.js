'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var utilPivot = require('@analys/util-pivot');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');

class Chips {
  constructor(key, field, mode, pick, filter) {
    this.key = key;
    this.data = {};
    this.field = field;
    this.updater = Updater(this.data, mode);
    this.pick = pick;
    this.filter = filter;
  }

  static build(key, field, mode, pick, filter) {
    return new Chips(key, field, mode, pick, filter);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    let key = sample[this.key];
    if (this.pick) key = this.pick(key);
    this.updater(key, sample[this.field]);
  }

  toObject() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data);
  }

  toSamples() {
    const head = [this.key, this.field];
    return Object.entries(this.data).map(ent => objectInit.wind(head, ent));
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

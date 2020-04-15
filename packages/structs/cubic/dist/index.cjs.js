'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utilPivot = require('@analys/util-pivot');
var vectorZipper = require('@vect/vector-zipper');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const iterate = function (vec, fn, l) {
  l = l || vec && vec.length;

  for (let i = 0; i < l; i++) fn.call(this, vec[i], i);
};

class Cubic {
  /** @type {Function} */
  constructor([x, xmap], [y, ymap], fields, filter) {
    _defineProperty(this, "cell", void 0);

    this.x = x;
    this.xm = xmap;
    this.y = y;
    this.ym = ymap;
    this.fields = fields.map(([index, mode]) => [index, utilPivot.modeToTally(mode, filter)]);
    const inits = fields.map(([, mode]) => utilPivot.modeToInit(mode));
    this.data = {
      s: [],
      b: [],
      m: [],
      n: () => inits.map(fn => fn())
    };
  }

  static build(x, y, fields, filter) {
    return new Cubic(x, y, fields, filter);
  }

  record(samples) {
    return this.cell = utilPivot.ampliCell.bind(this.data), iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const sk = this.xm ? this.xm(sample[this.x]) : sample[this.x];
    const bk = this.ym ? this.ym(sample[this.y]) : sample[this.y];
    vectorZipper.mutazip(this.cell(sk, bk), this.fields, (target, [index, tally]) => tally(target, sample[index]));
  }

  toObject() {
    const {
      s,
      b,
      m
    } = this.data;
    return {
      side: s,
      head: b,
      rows: m
    };
  }

}

exports.Cubic = Cubic;

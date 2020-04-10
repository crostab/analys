'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorMapper = require('@vect/vector-mapper');
var vectorZipper = require('@vect/vector-zipper');
var mergeAcquire = require('@vect/merge-acquire');
var utilPivot = require('@analys/util-pivot');

class Group {
  constructor(key, fields, filter) {
    this.key = key;
    this.data = {};
    this.fields = fields.map(([index, mode]) => [index, utilPivot.Accrual(mode)]);
    const inits = fields.map(([, mode]) => mode === enumPivotMode.INCRE || mode === enumPivotMode.COUNT ? () => 0 : () => []);

    this.init = () => inits.map(fn => fn());

    this.filter = filter;
    this.depth = fields.length;
  }

  static build(key, fields, filter) {
    return new Group(key, fields, filter);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = sample[this.key];
    vectorZipper.mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, accrue]) => accrue(target, sample[index]));
  }

  toJson() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data).map(([key, value]) => mergeAcquire.acquire([key], value));
  }

}

exports.Group = Group;

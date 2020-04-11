'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var utilPivot = require('@analys/util-pivot');
var mergeAcquire = require('@vect/merge-acquire');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
var vectorZipper = require('@vect/vector-zipper');

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

  get indexes() {
    return this.fields.map(([index]) => index);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = sample[this.key];
    vectorZipper.mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, accrue]) => accrue(target, sample[index]));
  }

  toObject() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data).map(([key, vec]) => mergeAcquire.acquire([key], vec));
  }

  toSamples() {
    const {
      indexes
    } = this;
    return Object.entries(this.data).map(([key, sample]) => Object.assign(objectInit.pair(this.key, key), objectInit.wind(indexes, sample)));
  }

}

exports.Group = Group;

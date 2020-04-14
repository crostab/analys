'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var utilPivot = require('@analys/util-pivot');
var mergeAcquire = require('@vect/merge-acquire');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
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

class Group {
  /** @type {*} */

  /** @type {Object} */

  /** @type {Array} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Function} */
  constructor(key, fields, pick, filter) {
    _defineProperty(this, "key", void 0);

    _defineProperty(this, "data", {});

    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "init", void 0);

    _defineProperty(this, "pick", void 0);

    _defineProperty(this, "filter", void 0);

    this.key = key;
    this.fields = fields.map(([index, mode]) => [index, utilPivot.Accrual(mode)]);
    const inits = fields.map(([, mode]) => mode === enumPivotMode.INCRE || mode === enumPivotMode.COUNT ? () => 0 : () => []),
          depth = inits.length;

    this.init = () => vectorMapper.mapper(inits, fn => fn(), depth);

    this.pick = pick;
    this.filter = filter;
  }

  static build(key, fields, pick, filter) {
    return new Group(key, fields, pick, filter);
  }

  get indexes() {
    return this.fields.map(([index]) => index);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    let key = sample[this.key];
    if (this.pick) key = this.pick(key);
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

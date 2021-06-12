'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utilPivot = require('@analys/util-pivot');
var vectorMerge = require('@vect/vector-merge');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
var vectorZipper = require('@vect/vector-zipper');

class Group {
  /** @type {*} */

  /** @type {Object} */

  /** @type {Array} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Array} */

  /**
   *
   * @param key
   * @param [to]
   * @param fields
   * @param [filter]
   * @param [aliases]
   */
  constructor([key, to], fields, filter, aliases) {
    this.key = void 0;
    this.data = {};
    this.fields = void 0;
    this.init = void 0;
    this.to = void 0;
    this.filter = void 0;
    this.aliases = void 0;
    this.key = key;
    this.to = to;
    this.fields = fields.map(([index, mode]) => [index, utilPivot.modeToTally(mode)]);
    const inits = fields.map(([, mode]) => utilPivot.modeToInit(mode)),
          depth = inits.length;

    this.init = () => vectorMapper.mapper(inits, fn => fn(), depth);

    this.filter = filter;
    this.aliases = aliases;
  }

  static build(p) {
    return new Group(p.key, p.fields, p.filter, p.aliases);
  }

  get indexes() {
    return this.fields.map(([index]) => index);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = this.to ? this.to(sample[this.key]) : sample[this.key];
    vectorZipper.mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, accum]) => accum(target, sample[index]));
  }

  toObject() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data).map(([key, vec]) => vectorMerge.acquire([key], vec));
  }

  toSamples() {
    const {
      indexes
    } = this;
    return Object.entries(this.data).map(([key, sample]) => Object.assign(objectInit.pair(this.key, key), objectInit.wind(indexes, sample)));
  }

}

exports.Group = Group;

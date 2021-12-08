'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utilPivot = require('@analys/util-pivot');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');

class Chips {
  /** @type {*} */
  key;
  /** @type {*} */

  field;
  /** @type {Object} */

  data = {};
  /** @type {Function} */

  to;
  /** @type {Function} */

  updater;
  /** @type {Function} */

  filter;
  /**
   *
   * @param key
   * @param [to]
   * @param field
   * @param mode
   * @param [filter]
   */

  constructor([key, to], [field, mode], filter) {
    this.key = key;
    this.to = to;
    this.field = field;
    this.init = utilPivot.modeToInit(mode);
    this.accum = utilPivot.modeToTally(mode);
    this.filter = filter;
  }

  static build([key, to], [field, mode], filter) {
    return new Chips([key, to], [field, mode], filter);
  }

  record(samples) {
    return vectorMapper.iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = this.to ? this.to(sample[this.key]) : sample[this.key];
    const target = key in this.data ? this.data[key] : this.data[key] = this.init();
    this.data[key] = this.accum(target, sample[this.field]);
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

exports.Chips = Chips;

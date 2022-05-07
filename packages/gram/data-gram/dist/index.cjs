'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var matrixMapper = require('@vect/matrix-mapper');
var vectorInit = require('@vect/vector-init');

const ZERO = 'zero';
class DataGram {
  /** @type {*[]}      */
  side = [];
  /** @type {*[]}      */

  head = [];
  /** @type {*[][]}    */

  rows = [];
  /** @type {function} */

  init = null;
  /** @type {*}        */

  val = null;

  constructor(element) {
    element instanceof Function ? this.init = element : this.val = element;
  }

  static build(element) {
    return new DataGram(element);
  }

  get zero() {
    var _this$init;

    return ((_this$init = this.init) === null || _this$init === void 0 ? void 0 : _this$init.call(this)) ?? this.val;
  }

  roin(x) {
    const i = this.side.indexOf(x);
    if (~i) return i;
    this.rows.push(vectorInit.collect.call(this, ZERO, this.head.length));
    return i + this.side.push(x);
  }

  coin(y) {
    const i = this.head.indexOf(y);
    if (~i) return i;

    for (let row of this.rows) row.push(this.zero);

    return i + this.head.push(y);
  }

  update(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)] = v;
  }

  append(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)].push(v);
  }

  assign(x, y, k, v) {
    return this.rows[this.roin(x)][this.coin(y)][k] = v;
  }

  mutate(x, y, fn) {
    const row = this.rows[this.roin(x)],
          coin = this.coin(y);
    return row[coin] = fn(row[coin]);
  }

  cell(x, y) {
    return this.rows[this.roin(x)][this.coin(y)];
  }

  query(x, y) {
    return ~(x = this.side.indexOf(x)) && ~(y = this.head.indexOf(y)) ? this.rows[x][y] : void 0;
  }

  toObject(po) {
    return {
      side: this.side,
      head: this.head,
      rows: po ? matrixMapper.mapper(this.rows, po) : this.rows
    };
  }

}

class List extends Array {
  constructor() {
    super();
  }

  static build() {
    return new List();
  }

  get count() {
    return this.length;
  }

  get sum() {
    return this.reduce((a, b) => a + b, 0);
  }

  get average() {
    return this.length ? this.sum / this.length : 0;
  }

  get max() {
    return Math.max.apply(null, this);
  }

  get min() {
    return Math.min.apply(null, this);
  }

}

const ACCUM = 'accum';
const INCRE = 'incre';
const COUNT = 'count';
const AVERAGE = 'average';
const MAX = 'max';
const MIN = 'min';
const FIRST = 'first';
const LAST = 'last';

const ZERO$1 = 'zero';

class DataGram$1 {
  /** @type {*[]}      */
  side = [];
  /** @type {*[]}      */

  head = [];
  /** @type {*[][]}    */

  rows = [];
  /** @type {function} */

  init = null;
  /** @type {*}        */

  val = null;

  constructor(element) {
    element instanceof Function ? this.init = element : this.val = element;
  }

  static build(element) {
    return new DataGram$1(element);
  }

  get zero() {
    var _this$init;

    return ((_this$init = this.init) === null || _this$init === void 0 ? void 0 : _this$init.call(this)) ?? this.val;
  }

  roin(x) {
    const i = this.side.indexOf(x);
    if (~i) return i;
    this.rows.push(vectorInit.collect.call(this, ZERO$1, this.head.length));
    return i + this.side.push(x);
  }

  coin(y) {
    const i = this.head.indexOf(y);
    if (~i) return i;

    for (let row of this.rows) row.push(this.zero);

    return i + this.head.push(y);
  }

  update(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)] = v;
  }

  append(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)].push(v);
  }

  assign(x, y, k, v) {
    return this.rows[this.roin(x)][this.coin(y)][k] = v;
  }

  mutate(x, y, fn) {
    const row = this.rows[this.roin(x)],
          coin = this.coin(y);
    return row[coin] = fn(row[coin]);
  }

  cell(x, y) {
    return this.rows[this.roin(x)][this.coin(y)];
  }

  query(x, y) {
    return ~(x = this.side.indexOf(x)) && ~(y = this.head.indexOf(y)) ? this.rows[x][y] : void 0;
  }

  toObject(po) {
    return {
      side: this.side,
      head: this.head,
      rows: po ? matrixMapper.mapper(this.rows, po) : this.rows
    };
  }

}

const nullish = x => x === null || x === void 0;

const valid = x => x !== null && x !== void 0;

class ListGram extends DataGram$1 {
  constructor(listInit = List.build) {
    super(listInit);
  }

  static build(listInit) {
    return new ListGram(listInit);
  }

  update(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)].push(v);
  }

  toObject(fn) {
    return {
      side: this.side,
      head: this.head,
      rows: matrixMapper.mapper(this.rows, fn ?? (li => li.average))
    };
  }

}
class MaxGram extends DataGram$1 {
  constructor() {
    super(Number.NEGATIVE_INFINITY);
  }

  static build() {
    return new MaxGram();
  }

  update(x, y, v) {
    const row = this.rows[this.roin(x)],
          yi = this.coin(y);
    if (v > row[yi]) row[yi] = v;
  }

}
class MinGram extends DataGram$1 {
  constructor() {
    super(Number.POSITIVE_INFINITY);
  }

  static build() {
    return new MinGram();
  }

  update(x, y, v) {
    const row = this.rows[this.roin(x)],
          yi = this.coin(y);
    if (v < row[yi]) row[yi] = v;
  }

}
class SumGram extends DataGram$1 {
  constructor() {
    super(0);
  }

  static build() {
    return new SumGram();
  }

  update(x, y, v) {
    return this.rows[this.roin(x)][this.coin(y)] += v;
  }

}
class CountGram extends DataGram$1 {
  constructor() {
    super(0);
  }

  static build() {
    return new CountGram();
  }

  update(x, y, _) {
    return this.rows[this.roin(x)][this.coin(y)]++;
  }

}
class FirstGram extends DataGram$1 {
  constructor() {
    super(null);
  }

  static build() {
    return new SumGram();
  }

  update(x, y, v) {
    const row = this.rows[this.roin(x)],
          yi = this.coin(y);
    if (nullish(row[yi])) row[yi] = v;
  }

}
class LastGram extends DataGram$1 {
  constructor() {
    super(null);
  }

  static build() {
    return new SumGram();
  }

  update(x, y, v) {
    if (valid(v)) this.rows[this.roin(x)][this.coin(y)] = v;
  }

}

/** @typedef {{update,toObject}} IDataGram */

class GramUtil {
  /**
   * @param {string} mode
   * @returns {DataGram|IDataGram}
   */
  static factory(mode) {
    if (mode === ACCUM || mode === AVERAGE) return ListGram.build();
    if (mode === COUNT) return CountGram.build();
    if (mode === INCRE) return SumGram.build();
    if (mode === MAX) return MaxGram.build();
    if (mode === MIN) return MinGram.build();
    if (mode === FIRST) return FirstGram.build();
    if (mode === LAST) return LastGram.build();
    return ListGram.build();
  }

}

exports.CountGram = CountGram;
exports.DataGram = DataGram;
exports.FirstGram = FirstGram;
exports.GramUtil = GramUtil;
exports.LastGram = LastGram;
exports.List = List;
exports.ListGram = ListGram;
exports.MaxGram = MaxGram;
exports.MinGram = MinGram;
exports.SumGram = SumGram;

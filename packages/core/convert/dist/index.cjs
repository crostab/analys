'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tabular = require('@analys/tabular');
var tableInit = require('@analys/table-init');
var entriesUnwind = require('@vect/entries-unwind');
var vectorMapper = require('@vect/vector-mapper');
var vectorSelect = require('@vect/vector-select');
var table = require('@analys/table');
var crostab = require('@analys/crostab');
var objectSelect = require('@vect/object-select');
var vectorIndex = require('@vect/vector-index');
var vectorMerge = require('@vect/vector-merge');
var objectMapper = require('@vect/object-mapper');
var objectUpdate = require('@vect/object-update');
var nested = require('@vect/nested');
var crostabIndexed = require('@analys/crostab-indexed');
require('@typen/nullish');

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} samples
 */

const tableToSamples = (table, fields) => fields !== null && fields !== void 0 && fields.length ? tabular.selectTabularToSamples.call(tableInit.matchSlice(table), fields) : tabular.tabularToSamples.call(tableInit.matchSlice(table));

/**
 *
 * @param {Object} o
 * @returns {Table}
 */

const toTable = o => new table.Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {Table}
 */

const samplesToTable = (samples, fields) => {
  var _samplesToTabular;

  return _samplesToTabular = samplesToTabular(samples, fields), toTable(_samplesToTabular);
};
/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {TableObject}
 */

function samplesToTabular(samples, fields) {
  var _selectFieldMapping$c;

  let height, width;
  if (!(height = samples === null || samples === void 0 ? void 0 : samples.length)) return tabular.voidTabular();
  if (!(fields !== null && fields !== void 0 && fields.length)) return convertSamplesToTabular(samples);
  const [keys, head] = (_selectFieldMapping$c = selectFieldMapping.call(samples[0], fields), entriesUnwind.unwind(_selectFieldMapping$c));
  if (!(width = keys === null || keys === void 0 ? void 0 : keys.length)) return tabular.voidTabular();
  const rows = vectorMapper.mapper(samples, sample => vectorSelect.select(sample, keys, width), height);
  return {
    head,
    rows
  };
}
const selectFieldMapping = function (fields) {
  const sample = this,
        mapping = [],
        fieldMapper = fieldMapping.bind(sample);
  let kvp;
  vectorMapper.iterate(fields, field => {
    if (kvp = fieldMapper(field)) mapping.push(kvp);
  });
  return mapping;
};
/**
 *
 * @param {str|[*,*]} [field]
 * @returns {[str,number]}
 */

const fieldMapping = function (field) {
  const sample = this;

  if (Array.isArray(field)) {
    const [current, projected] = field;
    return current in sample ? [current, projected] : null;
  }

  return field in sample ? [field, field] : null;
};
function convertSamplesToTabular(samples) {
  var _Object$entries;

  const height = samples === null || samples === void 0 ? void 0 : samples.length;
  if (!height) return tabular.voidTabular();
  const rows = Array(height);
  let head;
  [head, rows[0]] = (_Object$entries = Object.entries(samples[0]), entriesUnwind.unwind(_Object$entries));

  for (let i = 1, w = (_head = head) === null || _head === void 0 ? void 0 : _head.length; i < height; i++) {
    var _head;

    rows[i] = vectorSelect.select(samples[i], head, w);
  }

  return {
    head,
    rows
  };
}

/**
 *
 * @param sampleCollection
 * @param {Object} config
 * @param {[]} config.side
 * @param {[]} config.head
 * @returns {CrosTab}
 */

function samplesToCrostab(sampleCollection, config = {}) {
  var _samples;

  const samples = config.side ? objectSelect.selectValues(sampleCollection, config.side) : Object.values(sampleCollection);
  const side = config.side ?? Object.keys(sampleCollection);
  const head = config.head ?? Object.keys((_samples = samples, vectorIndex.first(_samples)));
  const rows = samples.map(config.head ? objectSelect.SelectValues(config.head) : Object.values);
  return crostab.CrosTab.from({
    side,
    head,
    rows
  });
}

function duozipper(a, b) {
  let {
    fn,
    hi,
    lo
  } = this;
  const zip = Array(hi = hi ?? (a === null || a === void 0 ? void 0 : a.length));

  for (let i = lo ?? 0; i < hi; i++) zip[i] = fn(a[i], b[i], i);

  return zip;
}
/**
 * zip two arrays, return the zipped array
 * @param {Array} a
 * @param {Array} b
 * @param {function(*,*,number?):*} fn
 * @param {number} [hi]
 * @returns {*[]}
 */


const zipper = (a, b, fn, hi) => duozipper.call({
  fn,
  hi
}, a, b);

const crostabToTable = (crostab, title) => {
  const head = vectorMerge.acquire([title ?? crostab.title ?? ''], crostab.head);
  const rows = zipper(crostab.side, crostab.rows, (x, row) => vectorMerge.acquire([x], row));
  return {
    head,
    rows
  };
};
const tableToMatrix = table => {
  const {
    head,
    rows
  } = table;
  return vectorMerge.acquire([head], rows);
};
const crostabToMatrix = (crostab, title) => {
  var _crostabToTable;

  return _crostabToTable = crostabToTable(crostab, title), tableToMatrix(_crostabToTable);
};

const groupedToSurject = grouped => {
  const o = {};

  for (let y in grouped) {
    if (Array.isArray(grouped[y])) for (let x of grouped[y]) {
      if (!(x in o)) o[x] = y;
    }
  }

  return o;
};

/**
 *
 * @param {Object} surject
 * @param {function(*,*):boolean} [by]
 * @param {function(*,*):[*,*]} [to]
 * @returns {Object<string,[]>}
 */

const surjectToGrouped = (surject, by, to) => {
  const grouped = {};

  if (by || to) {
    for (let [x, y] of objectMapper.indexed(surject, by, to)) objectUpdate.appendValue.call(grouped, y, x);

    return grouped;
  } else {
    for (let x in surject) objectUpdate.appendValue.call(grouped, surject[x], x);

    return grouped;
  }
};

const nestedToTable = (nested$1, {
  head,
  title,
  filter
}) => {
  const enumerator = filter ? nested.filterIndexed(nested$1, filter) : nested.simpleIndexed(nested$1);
  return table.Table.from({
    head: head,
    rows: [...enumerator],
    title: title
  });
};

/**
 *
 * @param {Table} table
 * @param x
 * @param y
 * @param v
 */
const tableToNested = (table, {
  x,
  y,
  v
}) => {
  const nested = {};
  const xi = table.coin(x),
        yi = table.coin(y),
        vi = table.coin(v);

  for (let row of table.rows) {
    x = row[xi];
    y = row[yi];
    v = row[vi];
    (nested[x] ?? (nested[x] = {}))[y] = v;
  }

  return nested;
};

const crostabToNested = (crostab, by, to) => {
  const o = {};

  for (const [x, y, v] of crostabIndexed.indexed(crostab, by, to)) nested.updateCell.call(o, x, y, v);

  return o;
};

/**
 *
 * @param {*[][]} mx
 * @param {function} fn
 * @param {number} [h]
 * @param {number} [w]
 * @returns {undefined}
 */
/**
 * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
 * @param {*[][]} mx
 * @param {function} fn
 * @param {number} [h]
 * @param {number} [w]
 * @returns {*[]}
 */


const mapper = (mx, fn, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);
  const tx = Array(h);

  for (let i = 0, j, r, tr; i < h; i++) for (tx[i] = tr = Array(w), r = mx[i], j = 0; j < w; j++) tr[j] = fn(r[j], i, j);

  return tx;
};

function collect(key, size) {
  const vec = Array(size);

  for (let i = 0; i < size; i++) vec[i] = this[key];

  return vec;
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
    this.rows.push(collect.call(this, ZERO, this.head.length));
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
      rows: po ? mapper(this.rows, po) : this.rows
    };
  }

}

const nullish = x => x === null || x === void 0;

const valid = x => x !== null && x !== void 0;

class ListGram extends DataGram {
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
      rows: mapper(this.rows, fn ?? (li => li.average))
    };
  }

}

class MaxGram extends DataGram {
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

class MinGram extends DataGram {
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

class SumGram extends DataGram {
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

class CountGram extends DataGram {
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

class FirstGram extends DataGram {
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

class LastGram extends DataGram {
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

function nestedToCrostab(nested$1, mode, by, to, po) {
  const gram = GramUtil.factory(mode);

  for (let [x, y, v] of nested.indexed(nested$1, by, to)) {
    gram.update(x, y, v);
  }

  return crostab.Crostab.from(gram.toObject(po));
}
function nestedToListGram(nested$1, by, to) {
  const gram = ListGram.build();

  for (let [x, y, v] of nested.indexed(nested$1, by, to)) {
    gram.append(x, y, v);
  }

  return gram;
}

exports.crostabToMatrix = crostabToMatrix;
exports.crostabToNested = crostabToNested;
exports.crostabToTable = crostabToTable;
exports.groupedToSurject = groupedToSurject;
exports.nestedToCrostab = nestedToCrostab;
exports.nestedToListGram = nestedToListGram;
exports.nestedToTable = nestedToTable;
exports.samplesToCrostab = samplesToCrostab;
exports.samplesToTable = samplesToTable;
exports.samplesToTabular = samplesToTabular;
exports.surjectToGrouped = surjectToGrouped;
exports.tableToMatrix = tableToMatrix;
exports.tableToNested = tableToNested;
exports.tableToSamples = tableToSamples;
exports.toTable = toTable;

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
 * @param {function(*,*):boolean} by
 * @param {function(*,*):[*,*]} to
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

function collect(key, size) {
  const vec = Array(size);

  for (let i = 0; i < size; i++) vec[i] = this[key];

  return vec;
}

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

  roflex(x) {
    const i = this.side.indexOf(x);
    if (~i) return i;
    this.rows.push(collect.call(this, ZERO, this.head.length));
    return i + this.side.push(x);
  }

  coflex(y) {
    const i = this.head.indexOf(y);
    if (~i) return i;

    for (let row of this.rows) row.push(this.zero);

    return i + this.head.push(y);
  }

  update(x, y, v) {
    return this.rows[this.roflex(x)][this.coflex(y)] = v;
  }

  append(x, y, v) {
    return this.rows[this.roflex(x)][this.coflex(y)].push(v);
  }

  assign(x, y, k, v) {
    return this.rows[this.roflex(x)][this.coflex(y)][k] = v;
  }

  mutate(x, y, fn) {
    const row = this.rows[this.roflex(x)],
          coin = this.coflex(y);
    return row[coin] = fn(row[coin]);
  }

  cell(x, y) {
    return this.rows[this.roflex(x)][this.coflex(y)];
  }

  query(x, y) {
    return ~(x = this.side.indexOf(x)) && ~(y = this.head.indexOf(y)) ? this.rows[x][y] : void 0;
  }

}

function nestedToCrostab(nested$1, init, by, to) {
  const dataGram = DataGram.build(init);

  for (let [x, y, v] of nested.indexed(nested$1, by, to)) {
    dataGram.update(x, y, v);
  }

  return crostab.Crostab.from(dataGram);
}
function nestedToCrostabOfArray(nested$1, by, to) {
  const dataGram = DataGram.build(Array);

  for (let [x, y, v] of nested.indexed(nested$1, by, to)) {
    dataGram.append(x, y, v);
  }

  return crostab.Crostab.from(dataGram);
}

exports.crostabToMatrix = crostabToMatrix;
exports.crostabToNested = crostabToNested;
exports.crostabToTable = crostabToTable;
exports.groupedToSurject = groupedToSurject;
exports.nestedToCrostab = nestedToCrostab;
exports.nestedToCrostabOfArray = nestedToCrostabOfArray;
exports.nestedToTable = nestedToTable;
exports.samplesToCrostab = samplesToCrostab;
exports.samplesToTable = samplesToTable;
exports.samplesToTabular = samplesToTabular;
exports.surjectToGrouped = surjectToGrouped;
exports.tableToMatrix = tableToMatrix;
exports.tableToNested = tableToNested;
exports.tableToSamples = tableToSamples;
exports.toTable = toTable;

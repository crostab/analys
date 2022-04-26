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
var crostabIndexed = require('@analys/crostab-indexed');
var nested = require('@vect/nested');

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

const groupedToSurject = grouped => {
  const o = {};

  for (let y in grouped) {
    if (Array.isArray(grouped[y])) for (let x of grouped[y]) {
      if (!(x in o)) o[x] = y;
    }
  }

  return o;
};

const surjectToGrouped = surject => {
  const o = {};

  for (let x in surject) {
    const y = surject[x];
    (o[y] ?? (o[y] = [])).push(x);
  }
};

// from x => typeof x
const FUN = 'function';

const crostabToNested = (crostab, filter) => {
  // const by = conf?.by, to = conf?.to ?? conf
  const o = {};

  if (typeof filter === FUN) {
    for (const [x, y, v] of crostabIndexed.filterIndexed(crostab, filter)) (o[x] ?? (o[x] = {}))[y] = v;
  } else {
    for (const [x, y, v] of crostabIndexed.simpleIndexed(crostab)) (o[x] ?? (o[x] = {}))[y] = v;
  }

  return o;
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

exports.crostabToNested = crostabToNested;
exports.groupedToSurject = groupedToSurject;
exports.nestedToTable = nestedToTable;
exports.samplesToCrostab = samplesToCrostab;
exports.samplesToTable = samplesToTable;
exports.samplesToTabular = samplesToTabular;
exports.surjectToGrouped = surjectToGrouped;
exports.tableToNested = tableToNested;
exports.tableToSamples = tableToSamples;
exports.toTable = toTable;

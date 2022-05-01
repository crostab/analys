import { selectTabularToSamples, tabularToSamples, voidTabular } from '@analys/tabular';
import { matchSlice } from '@analys/table-init';
import { unwind } from '@vect/entries-unwind';
import { mapper, iterate } from '@vect/vector-mapper';
import { select } from '@vect/vector-select';
import { Table } from '@analys/table';
import { CrosTab } from '@analys/crostab';
import { selectValues, SelectValues } from '@vect/object-select';
import { first } from '@vect/vector-index';
import { filterIndexed, simpleIndexed } from '@analys/crostab-indexed';
import { filterIndexed as filterIndexed$1, simpleIndexed as simpleIndexed$1 } from '@vect/nested';
import { acquire } from '@vect/vector-merge';

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} samples
 */

const tableToSamples = (table, fields) => fields !== null && fields !== void 0 && fields.length ? selectTabularToSamples.call(matchSlice(table), fields) : tabularToSamples.call(matchSlice(table));

/**
 *
 * @param {Object} o
 * @returns {Table}
 */

const toTable = o => new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);

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
  if (!(height = samples === null || samples === void 0 ? void 0 : samples.length)) return voidTabular();
  if (!(fields !== null && fields !== void 0 && fields.length)) return convertSamplesToTabular(samples);
  const [keys, head] = (_selectFieldMapping$c = selectFieldMapping.call(samples[0], fields), unwind(_selectFieldMapping$c));
  if (!(width = keys === null || keys === void 0 ? void 0 : keys.length)) return voidTabular();
  const rows = mapper(samples, sample => select(sample, keys, width), height);
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
  iterate(fields, field => {
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
  if (!height) return voidTabular();
  const rows = Array(height);
  let head;
  [head, rows[0]] = (_Object$entries = Object.entries(samples[0]), unwind(_Object$entries));

  for (let i = 1, w = (_head = head) === null || _head === void 0 ? void 0 : _head.length; i < height; i++) {
    var _head;

    rows[i] = select(samples[i], head, w);
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

  const samples = config.side ? selectValues(sampleCollection, config.side) : Object.values(sampleCollection);
  const side = config.side ?? Object.keys(sampleCollection);
  const head = config.head ?? Object.keys((_samples = samples, first(_samples)));
  const rows = samples.map(config.head ? SelectValues(config.head) : Object.values);
  return CrosTab.from({
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
  const grouped = {};

  for (let x in surject) {
    const y = surject[x];
    (grouped[y] ?? (grouped[y] = [])).push(x);
  }

  return grouped;
};

// from x => typeof x
const FUN = 'function';

const crostabToNested = (crostab, filter) => {
  // const by = conf?.by, to = conf?.to ?? conf
  const o = {};

  if (typeof filter === FUN) {
    for (const [x, y, v] of filterIndexed(crostab, filter)) (o[x] ?? (o[x] = {}))[y] = v;
  } else {
    for (const [x, y, v] of simpleIndexed(crostab)) (o[x] ?? (o[x] = {}))[y] = v;
  }

  return o;
};

const nestedToTable = (nested, {
  head,
  title,
  filter
}) => {
  const enumerator = filter ? filterIndexed$1(nested, filter) : simpleIndexed$1(nested);
  return Table.from({
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
  const head = acquire([title ?? crostab.title ?? ''], crostab.head);
  const rows = zipper(crostab.side, crostab.rows, (x, row) => acquire([x], row));
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
  return acquire([head], rows);
};
const crostabToMatrix = (crostab, title) => {
  var _crostabToTable;

  return _crostabToTable = crostabToTable(crostab, title), tableToMatrix(_crostabToTable);
};

export { crostabToMatrix, crostabToNested, crostabToTable, groupedToSurject, nestedToTable, samplesToCrostab, samplesToTable, samplesToTabular, surjectToGrouped, tableToMatrix, tableToNested, tableToSamples, toTable };

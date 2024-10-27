import { selectTabularToSamples, tabularToSamples, voidTabular } from '@analys/tabular';
import { matchSlice } from '@analys/table-init';
import { unwind } from '@vect/entries-unwind';
import { mapper, iterate } from '@vect/vector-mapper';
import { select } from '@vect/vector-select';
import { Table } from '@analys/table';
import { CrosTab, Crostab } from '@analys/crostab';
import { selectValues, SelectValues } from '@vect/object-select';
import { first } from '@vect/vector-index';
import { acquire } from '@vect/vector-algebra';
import { zipper } from '@vect/vector-zipper';
import { indexed } from '@vect/object-mapper';
import { appendValue } from '@vect/object-update';
import { indexed as indexed$1, updateCell } from '@vect/nested';
import { indexed as indexed$2 } from '@analys/crostab-mapper';
import { GramUtil, ListGram } from '@analys/data-gram';

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} util-samples
 */
const tableToSamples = (table, fields) =>
  fields?.length
    ? selectTabularToSamples.call(matchSlice(table), fields)
    : tabularToSamples.call(matchSlice(table));

/**
 *
 * @param {Object} o
 * @returns {Table}
 */
const toTable = (o) => new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {Table}
 */
const samplesToTable = (samples, fields) =>
  toTable(samplesToTabular(samples, fields));

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {TableObject}
 */
function samplesToTabular(samples, fields) {
  let height, width;
  if (!(height = samples?.length)) return voidTabular()
  if (!fields?.length) return convertSamplesToTabular(samples)
  const [keys, head] = unwind(selectFieldMapping.call(samples[0], fields));
  if (!(width = keys?.length)) return voidTabular()
  const rows = mapper(samples, sample => select(sample, keys, width), height);
  return { head, rows }
}

const selectFieldMapping = function (fields) {
  const sample = this, mapping = [], fieldMapper = fieldMapping.bind(sample);
  let kvp;
  iterate(fields, field => { if ((kvp = fieldMapper(field))) mapping.push(kvp); });
  return mapping
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
    return current in sample
      ? [current, projected]
      : null
  }
  return field in sample
    ? [field, field]
    : null
};

function convertSamplesToTabular(samples) {
  const height = samples?.length;
  if (!height) return voidTabular()
  const rows = Array(height);
  let head;
  [head, rows[0]] = unwind(Object.entries(samples[0]));
  for (let i = 1, w = head?.length; i < height; i++) rows[i] = select(samples[i], head, w);
  return { head, rows }
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
  const samples = config.side ? selectValues(sampleCollection, config.side) : Object.values(sampleCollection);
  const side = config.side ?? Object.keys(sampleCollection);
  const head = config.head ?? Object.keys(first(samples));
  const rows = samples.map(config.head ? SelectValues(config.head) : Object.values);
  return CrosTab.from({ side, head, rows })
}

const crostabToTable = (crostab, title) => {
  const head = acquire([ title ?? crostab.title ?? '' ], crostab.head);
  const rows = zipper(crostab.side, crostab.rows, (x, row) => acquire([ x ], row));
  return { head, rows }
};

const tableToMatrix = table => {
  const { head, rows } = table;
  return acquire([ head ], rows)
};

const crostabToMatrix = (crostab, title) => {
  return tableToMatrix(crostabToTable(crostab, title))
};

const groupedToSurject = grouped => {
  const o = {};
  for (let y in grouped) {
    if (Array.isArray(grouped[y])) for (let x of grouped[y]) {
      if (!(x in o)) o[x] = y;
    }
  }
  return o
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
    for (let [ x, y ] of indexed(surject, by, to)) appendValue.call(grouped, y, x);
    return grouped
  }
  else {
    for (let x in surject) appendValue.call(grouped, surject[x], x);
    return grouped
  }

};

const nestedToTable = (nested, {head, title, by, to}) => {
  return Table.from({
    head: head,
    rows: [ ...indexed$1(nested, by, to) ],
    title: title
  })
};

/**
 *
 * @param {Table} table
 * @param x
 * @param y
 * @param v
 */
const tableToNested = (table, { x, y, v }) => {
  const nested = {};
  const xi = table.coin(x), yi = table.coin(y), vi = table.coin(v);
  for (let row of table.rows) {
    x = row[xi];
    y = row[yi];
    v = row[vi];
    (nested[x] ?? (nested[x] = {}))[y] = v;
  }
  return nested
};

const crostabToNested = (crostab, by, to) => {
  const o = {};
  for (const [ x, y, v ] of indexed$2(crostab, by, to)) updateCell.call(o, x, y, v);
  return o
};

function nestedToCrostab(nested, mode, by, to, po) {
  const gram = GramUtil.factory(mode);
  for (let [ x, y, v ] of indexed$1(nested, by, to)) {
    gram.update(x, y, v);
  }
  return Crostab.from(gram.toObject(po))
}

function nestedToListGram(nested, by, to) {
  const gram = ListGram.build();
  for (let [ x, y, v ] of indexed$1(nested, by, to)) {
    gram.append(x, y, v);
  }
  return gram
}

export { crostabToMatrix, crostabToNested, crostabToTable, groupedToSurject, nestedToCrostab, nestedToListGram, nestedToTable, samplesToCrostab, samplesToTable, samplesToTabular, surjectToGrouped, tableToMatrix, tableToNested, tableToSamples, toTable };

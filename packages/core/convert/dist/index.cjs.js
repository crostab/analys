'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var keyedColumns = require('@analys/keyed-columns');
var tableInit = require('@analys/table-init');
var entriesUnwind = require('@vect/entries-unwind');
var vectorMapper = require('@vect/vector-mapper');

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} samples
 */

const tableToSamples = (table, fields) => (fields === null || fields === void 0 ? void 0 : fields.length) ? keyedColumns.selectSamplesByHead.call(tableInit.matchSlice(table), fields) : keyedColumns.keyedColumnsToSamples.call(tableInit.matchSlice(table));

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {TableObject}
 */

function samplesToTable(samples, fields) {
  var _lookupKeyHeadPairs$c;

  let h, w;
  if (!(h = samples === null || samples === void 0 ? void 0 : samples.length)) return voidTable();
  if (!(fields === null || fields === void 0 ? void 0 : fields.length)) return samplesToTableDirectly(samples);
  const [keys, head] = (_lookupKeyHeadPairs$c = lookupKeyHeadPairs.call(samples[0], fields), entriesUnwind.unwind(_lookupKeyHeadPairs$c));
  if (!(w = keys === null || keys === void 0 ? void 0 : keys.length)) return voidTable();
  const rows = vectorMapper.mapper(samples, sample => vectorMapper.mapper(keys, key => sample[key], w), h);
  return {
    head,
    rows
  };
}

const voidTable = () => ({
  head: [],
  rows: [[]]
});

const lookupKeyHeadPairs = function (fields) {
  const sample = this,
        keyHeadPairs = [];
  let keyHead;
  vectorMapper.iterate(fields, field => {
    if (keyHead = lookupKeyHeadPair.call(sample, field)) keyHeadPairs.push(keyHead);
  });
  return keyHeadPairs;
};
/**
 *
 * @param {str|[*,*]} [field]
 * @returns {[str,number]}
 */

const lookupKeyHeadPair = function (field) {
  const sample = this;
  if (!Array.isArray(field) && field in sample) return [field, field];
  let [current, projected] = field;
  return current in sample ? [current, projected] : void 0;
};
function samplesToTableDirectly(samples) {
  const h = samples === null || samples === void 0 ? void 0 : samples.length;
  let head,
      rows = Array(h);

  if (h) {
    var _Object$entries;

    [head, rows[0]] = (_Object$entries = Object.entries(samples[0]), entriesUnwind.unwind(_Object$entries));

    for (let i = 1, sample, w = head.length; i < h; i++) sample = samples[i], rows[i] = vectorMapper.mapper(head, field => sample[field], w);
  }

  return {
    head,
    rows
  };
}

exports.samplesToTable = samplesToTable;
exports.tableToSamples = tableToSamples;

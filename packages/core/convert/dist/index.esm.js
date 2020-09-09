import { selectSamplesByHead, keyedColumnsToSamples } from '@analys/keyed-columns';
import { matchSlice } from '@analys/table-init';
import { unwind } from '@vect/entries-unwind';
import { mapper, iterate } from '@vect/vector-mapper';

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @returns {Object[]} samples
 */

const tableToSamples = (table, fields) => (fields === null || fields === void 0 ? void 0 : fields.length) ? selectSamplesByHead.call(matchSlice(table), fields) : keyedColumnsToSamples.call(matchSlice(table));

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
  const [keys, head] = (_lookupKeyHeadPairs$c = lookupKeyHeadPairs.call(samples[0], fields), unwind(_lookupKeyHeadPairs$c));
  if (!(w = keys === null || keys === void 0 ? void 0 : keys.length)) return voidTable();
  const rows = mapper(samples, sample => mapper(keys, key => sample[key], w), h);
  return {
    head,
    rows
  };
}

const voidTable = () => ({
  head: [],
  rows: []
});

const lookupKeyHeadPairs = function (fields) {
  const sample = this,
        keyHeadPairs = [];
  let keyHead;
  iterate(fields, field => {
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

    [head, rows[0]] = (_Object$entries = Object.entries(samples[0]), unwind(_Object$entries));

    for (let i = 1, sample, w = head.length; i < h; i++) sample = samples[i], rows[i] = mapper(head, field => sample[field], w);
  }

  return {
    head,
    rows
  };
}

export { samplesToTable, tableToSamples };

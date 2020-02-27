import { selectSamplesByHead, keyedColumnsToSamples } from '@analys/keyed-columns';
import { matchSlice } from '@analys/table-init';

const tableToSamples = (table, head) => {
  var _table, _table2;

  return (head === null || head === void 0 ? void 0 : head.length) ? selectSamplesByHead.call((_table = table, matchSlice(_table)), head) : keyedColumnsToSamples.call((_table2 = table, matchSlice(_table2)));
};

export { tableToSamples };

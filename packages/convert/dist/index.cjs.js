'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var keyedColumns = require('@analys/keyed-columns');
var tableInit = require('@analys/table-init');

const tableToSamples = (table, head) => {
  var _table, _table2;

  return (head === null || head === void 0 ? void 0 : head.length) ? keyedColumns.selectSamplesByHead.call((_table = table, tableInit.matchSlice(_table)), head) : keyedColumns.keyedColumnsToSamples.call((_table2 = table, tableInit.matchSlice(_table2)));
};

exports.tableToSamples = tableToSamples;

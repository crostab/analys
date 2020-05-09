'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDifferenceModes = require('@analys/enum-difference-modes');
var tableTimeseriesDifferential = require('@analys/table-timeseries-differential');
var tableTimeseriesRolling = require('@analys/table-timeseries-rolling');
var enumDataTypes = require('@typen/enum-data-types');

const differential = function ({
  mode = enumDifferenceModes.DIFFERENCE,
  dateLabel = 'date',
  fields,
  depth = 4,
  mutate = true
}) {
  /** @type {Table} */
  let table = this;

  if (typeof mode === enumDataTypes.NUM) {
    if (mode === enumDifferenceModes.DIFFERENCE) return tableTimeseriesDifferential.timeseriesDifferential.call(table, {
      dateLabel,
      fields,
      mutate
    });
    if (mode === enumDifferenceModes.ROLLING) return tableTimeseriesRolling.timeseriesRolling.call(table, {
      dateLabel,
      fields,
      depth,
      mutate
    });
  }

  if (Array.isArray(mode)) {
    if (mode.includes(enumDifferenceModes.DIFFERENCE)) table = tableTimeseriesDifferential.timeseriesDifferential.call(table, {
      dateLabel,
      fields,
      mutate
    });
    if (mode.includes(enumDifferenceModes.ROLLING)) table = tableTimeseriesRolling.timeseriesRolling.call(table, {
      dateLabel,
      fields,
      depth,
      mutate
    });
  }

  return table;
};

exports.differential = differential;

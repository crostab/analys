'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pivot = require('@analys/pivot');
var cubic = require('@analys/cubic');
var crostab = require('@analys/crostab');
var tablespec = require('@analys/tablespec');
var samplesFilter = require('@analys/samples-filter');
var vectorMapper = require('@vect/vector-mapper');

/**
 *
 * @param {Object[]} samples
 * @param {str} side
 * @param {str} banner
 * @param {CubeCell[]|CubeCell} [cell]
 * @param {Filter[]|Filter} [filter]
 * @param {Filter[]|Filter} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const samplesPivot = (samples, {
  side,
  banner,
  cell,
  filter,
  formula
}) => {
  if (filter) {
    samples = samplesFilter.samplesFilter.call(samples, filter);
  }

  let calc;
  const pivot$1 = Array.isArray(cell = tablespec.parseCell(cell, side)) ? (calc = true, cubic.Cubic.build(side, banner, (vectorMapper.mapper(cell, appendIndex), cell))) : (calc = false, pivot.Pivot.build(side, banner, cell.field, cell.mode));
  const crostab$1 = crostab.CrosTab.from(pivot$1.spread(samples).toJson());
  if (calc && formula) crostab$1.map(ar => formula.apply(null, ar));
  return crostab$1;
};

const appendIndex = function (cell) {
  cell.index = cell.field;
};

exports.samplesPivot = samplesPivot;

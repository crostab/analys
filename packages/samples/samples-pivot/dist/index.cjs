'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cubic = require('@analys/cubic');
var pivot = require('@analys/pivot');
var samplesFind = require('@analys/samples-find');
var tablespec = require('@analys/tablespec');
var matrixMapper = require('@vect/matrix-mapper');

/**
 *
 * @param {Object[]} samples
 * @param {str} side
 * @param {str} banner
 * @param {*} [field]
 * @param {Object<string,function(?*):boolean>} [filter]
 * @param {Function} formula - formula is valid only when cell is CubeCell array.
 * @returns {Object}
 */

const samplesPivot = function ({
  side,
  banner,
  field,
  filter,
  formula
}) {
  let samples = this;

  if (filter) {
    samples = samplesFind.samplesFind.call(samples, filter);
  }

  let cubic$1;
  const crostabEngine = Array.isArray(field = tablespec.parseField(field, side)) ? (cubic$1 = true, new cubic.Cubic(side, banner, field)) : (cubic$1 = false, new pivot.Pivot(side, banner, field[0], field[1]));
  const crostab = crostabEngine.record(samples).toObject();
  if (cubic$1 && formula) matrixMapper.mutate(crostab.rows, vec => formula.apply(null, vec));
  return crostab;
};

exports.samplesPivot = samplesPivot;

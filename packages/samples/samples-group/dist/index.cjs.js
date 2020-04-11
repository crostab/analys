'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chips = require('@analys/chips');
var group = require('@analys/group');
var samplesFind = require('@analys/samples-find');
var tablespec = require('@analys/tablespec');
var matrix = require('@vect/matrix');

const samplesGroup = function ({
  key,
  field,
  filter
} = {}) {
  let samples = this;

  if (filter) {
    samples = samplesFind.samplesFind.call(samples, filter);
  }
  const groupingEngine = matrix.isMatrix(field = tablespec.parseField(field, key)) // field |> deco |> says['parsed field']
  ? (new group.Group(key, field)) : (new chips.Chips(key, field[0], field[1]));
  return groupingEngine.record(samples).toSamples();
};

exports.samplesGroup = samplesGroup;

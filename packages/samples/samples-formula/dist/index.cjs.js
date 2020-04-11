'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var formula = require('@analys/formula');
var samplesFind = require('@analys/samples-find');
var vectorZipper = require('@vect/vector-zipper');

const samplesFormula = function ({
  fields,
  formulas,
  filter,
  append = true
} = {}) {
  let samples = this;

  if (filter) {
    samples = samplesFind.samplesFind.call(samples, filter);
  }

  const formulaEngine = new formula.Formula(fields, formulas);
  const results = formulaEngine.calculate(samples).toSamples();
  return append ? vectorZipper.mutazip(samples, results, (sample, result) => Object.assign(sample, result)) : results;
};

exports.samplesFormula = samplesFormula;

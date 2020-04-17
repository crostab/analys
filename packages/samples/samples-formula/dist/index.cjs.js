'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var formula = require('@analys/formula');
var samplesFind = require('@analys/samples-find');
var decoFunc = require('@spare/deco-func');
var vectorZipper = require('@vect/vector-zipper');

const samplesFormula = function (formulae, {
  filter,
  append = true
} = {}) {
  let samples = this;

  if (filter) {
    samples = samplesFind.samplesFind.call(samples, filter);
  }

  for (let indicator in formulae) if (formulae.hasOwnProperty(indicator)) {
    const func = formulae[indicator];
    formulae[indicator] = [decoFunc.argnames(func), func];
  }

  const formulaEngine = new formula.Formula(formulae);
  const results = formulaEngine.calculate(samples).toSamples();
  return append ? vectorZipper.mutazip(samples, results, (sample, result) => Object.assign(sample, result)) : results;
};

exports.samplesFormula = samplesFormula;

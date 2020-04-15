'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');

const select = (vec, indexes, hi) => {
  hi = hi || indexes.length;
  const vc = Array(hi);

  for (--hi; hi >= 0; hi--) vc[hi] = vec[indexes[hi]];

  return vc;
};

class Formula {
  constructor(formulae) {
    this.data = []; // result rows

    this.formulae = Object.values(formulae);
    this.indicators = Object.keys(formulae);
    this.depth = formulae.length;
  }

  static build(formulae) {
    return new Formula(formulae);
  }

  calculate(samples) {
    this.data = samples.map(sample => vectorMapper.mapper(this.formulae, ([indexes, func]) => func.apply(sample, select(sample, indexes)), this.depth));
    return this;
  }

  toRows() {
    return this.data;
  }

  toSamples() {
    const {
      indicators
    } = this;
    return this.data.map(vec => objectInit.wind(indicators, vec));
  }

}

exports.Formula = Formula;

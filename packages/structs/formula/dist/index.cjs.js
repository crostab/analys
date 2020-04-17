'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
var vectorSelect = require('@vect/vector-select');

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
    this.data = samples.map(sample => vectorMapper.mapper(this.formulae, ([indexes, func]) => func.apply(sample, vectorSelect.select(sample, indexes)), this.depth));
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

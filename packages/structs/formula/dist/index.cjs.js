'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');

class Formula {
  constructor(fields, formulas) {
    this.data = [];
    this.fields = fields;
    this.formulas = formulas;
    this.depth = formulas.length;
  }

  static build(fields, formulas) {
    return new Formula(fields, formulas);
  }

  get formulaArray() {
    return Object.values(this.formulas);
  }

  get indexes() {
    return Object.keys(this.formulas);
  }

  calculate(samples) {
    const {
      formulaArray
    } = this;
    this.data = vectorMapper.mapper(samples, sample => vectorMapper.mapper(formulaArray, fn => fn.apply(sample, vectorMapper.mapper(this.fields, i => sample[i])), this.depth));
    return this;
  }

  toRows() {
    return this.data;
  }

  toSamples() {
    const {
      indexes
    } = this;
    return this.data.map(vec => objectInit.wind(indexes, vec));
  }

}

exports.Formula = Formula;

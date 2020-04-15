'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var samplesFind = require('@analys/samples-find');
var samplesGroup = require('@analys/samples-group');
var samplesPivot = require('@analys/samples-pivot');
var samplesSelect = require('@analys/samples-select');

const wind = (keys, values) => {
  const o = {},
        {
    length
  } = keys;

  for (let i = 0; i < length; i++) o[keys[i]] = values[i];

  return o;
};

const mapper = function (vec, fn, l) {
  l = l || vec && vec.length;
  const ar = Array(l);

  for (--l; l >= 0; l--) ar[l] = fn.call(this, vec[l], l);

  return ar;
};

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
    this.data = samples.map(sample => mapper(this.formulae, ([indexes, func]) => func.apply(sample, select(sample, indexes)), this.depth));
    return this;
  }

  toRows() {
    return this.data;
  }

  toSamples() {
    const {
      indicators
    } = this;
    return this.data.map(vec => wind(indicators, vec));
  }

}

const mutazip = (va, vb, fn, l) => {
  l = l || va && va.length;

  for (--l; l >= 0; l--) va[l] = fn(va[l], vb[l], l);

  return va;
};

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

  const formulaEngine = new Formula(fields, formulas);
  const results = formulaEngine.calculate(samples).toSamples();
  return append ? mutazip(samples, results, (sample, result) => Object.assign(sample, result)) : results;
};

class Samples {
  constructor(samples, title, types) {
    this.data = samples;
    this.title = title;
    this.types = types;
  }

  get length() {
    return this.data.length;
  }

  static from(samples) {
    return new Samples(samples);
  }

  select(fields, {
    mutate = true
  }) {
    const data = samplesSelect.samplesSelect.call(this.data, fields);
    return mutate ? this.boot({
      data,
      types: []
    }) : this.copy({
      data,
      types: []
    });
  }

  find(filter, {
    mutate = true
  }) {
    const data = samplesFind.samplesFind.call(this.data, filter);
    return mutate ? this.boot({
      data
    }) : this.copy({
      data
    });
  }

  formula(configs) {
    return samplesFormula.call();
  }

  group(configs) {
    return Samples.from(samplesGroup.samplesGroup.call(this.data, configs));
  }

  crosTab(tablespec) {
    return samplesPivot.samplesPivot.call(this.data, tablespec);
  }
  /** @returns {Samples} */


  boot({
    data,
    types
  } = {}, mutate) {
    if (mutate) {
      if (data) this.data = data;
      if (types) this.types = types;
      return this;
    } else {
      return this.copy({
        types,
        head,
        data
      });
    }
  }
  /** @returns {Samples} */


  copy({
    data,
    types
  } = {}) {
    var _this$types;

    if (!data) data = this.data.map(sample => Object.assign({}, sample));
    if (!types) types = (_this$types = this.types) === null || _this$types === void 0 ? void 0 : _this$types.slice();
    return new Samples(data, this.title, types);
  }

}

exports.Samples = Samples;

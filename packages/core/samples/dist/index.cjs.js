'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var samplesFind = require('@analys/samples-find');
var samplesFormula = require('@analys/samples-formula');
var samplesGroup = require('@analys/samples-group');
var samplesPivot = require('@analys/samples-pivot');
var samplesSelect = require('@analys/samples-select');

class Samples {
  constructor(samples, title, types) {
    this.title = title;
    this.data = samples;
    if (types) this.types = types;
  }

  get length() {
    return this.data.length;
  }

  static from(samples) {
    return new Samples(samples);
  }

  select(fields, {
    mutate = true
  } = {}) {
    const data = samplesSelect.samplesSelect(this.data, fields);
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
  } = {}) {
    const data = samplesFind.samplesFind.call(this.data, filter);
    return mutate ? this.boot({
      data
    }) : this.copy({
      data
    });
  }

  formula(formulae, configs = {}) {
    return Samples.from(samplesFormula.samplesFormula.call(this.data, formulae, configs));
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
        data,
        types
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
    if (!types) types = (_this$types = this.types) == null ? void 0 : _this$types.slice();
    return new Samples(data, this.title, types);
  }

}

exports.Samples = Samples;

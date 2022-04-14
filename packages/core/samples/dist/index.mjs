import { samplesFind } from '@analys/samples-find';
import { samplesFormula } from '@analys/samples-formula';
import { samplesGroup } from '@analys/samples-group';
import { samplesPivot } from '@analys/samples-pivot';
import { samplesSelect } from '@analys/samples-select';

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
    const data = samplesSelect(this.data, fields);
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
    const data = samplesFind.call(this.data, filter);
    return mutate ? this.boot({
      data
    }) : this.copy({
      data
    });
  }

  formula(formulae, configs = {}) {
    return Samples.from(samplesFormula.call(this.data, formulae, configs));
  }

  group(configs) {
    return Samples.from(samplesGroup.call(this.data, configs));
  }

  crosTab(tablespec) {
    return samplesPivot.call(this.data, tablespec);
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
    if (!types) types = (_this$types = this.types) === null || _this$types === void 0 ? void 0 : _this$types.slice();
    return new Samples(data, this.title, types);
  }

}

export { Samples };

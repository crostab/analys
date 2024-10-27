import { wind } from '@vect/object-init';
import { mapper } from '@vect/vector-mapper';
import { select } from '@vect/vector-select';

class Formula {
  constructor (formulae) {
    this.data = []; // result rows
    this.formulae = Object.values(formulae);
    this.indicators = Object.keys(formulae);
    this.depth = formulae.length;
  }

  static build (formulae) { return new Formula(formulae) }

  calculate (samples) {
    this.data = samples.map(sample =>
      mapper(
        this.formulae,
        ([indexes, func]) => func.apply(sample, select(sample, indexes)),
        this.depth
      )
    );
    return this
  }

  toRows () { return this.data }
  toSamples () {
    const { indicators } = this;
    return this.data.map(vec => wind(indicators, vec))
  }
}

export { Formula };

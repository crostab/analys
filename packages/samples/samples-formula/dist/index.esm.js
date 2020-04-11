import { Formula } from '@analys/formula';
import { samplesFind } from '@analys/samples-find';
import { mutazip } from '@vect/vector-zipper';

const samplesFormula = function ({
  fields,
  formulas,
  filter,
  append = true
} = {}) {
  let samples = this;

  if (filter) {
    samples = samplesFind.call(samples, filter);
  }

  const formulaEngine = new Formula(fields, formulas);
  const results = formulaEngine.calculate(samples).toSamples();
  return append ? mutazip(samples, results, (sample, result) => Object.assign(sample, result)) : results;
};

export { samplesFormula };

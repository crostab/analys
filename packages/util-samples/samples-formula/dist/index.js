import { Formula } from '@analys/formula';
import { samplesFind } from '@analys/samples-find';
import { argnames } from '@spare/deco-func';
import { mutazip } from '@vect/vector-zipper';

const samplesFormula = function (formulae, {
  filter,
  append = true
} = {}) {
  let samples = this;
  if (filter) { samples = samplesFind.call(samples, filter); }
  for (let indicator in formulae)
    if (formulae.hasOwnProperty(indicator)) {
      const func = formulae[indicator];
      formulae[indicator] = [argnames(func), func];
    }
  const formulaEngine = new Formula(formulae);
  const results = formulaEngine.calculate(samples).toSamples();
  return append
    ? mutazip(samples, results, (sample, result) => Object.assign(sample, result))
    : results
};

export { samplesFormula };

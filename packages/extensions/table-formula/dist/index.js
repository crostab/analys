import { Formula } from '@analys/formula';
import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { tableAcquire } from '@analys/table-algebra';
import { argnames } from '@spare/deco-func';

const tableFormula = function (formulae, {
  filter,
  append = true
} = {}) {
  const table = slice(this);
  if (filter) { tableFind.call(table, filter); }
  const { head, rows } = table;
  for (let indicator in formulae)
    if (formulae.hasOwnProperty(indicator)) {
      const func = formulae[indicator];
      const fields = argnames(func);
      const indexes = fields.map(name => head.indexOf(name), this);
      formulae[indicator] = [ indexes, func ];
    }
  const formulaEngine = new Formula(formulae);
  const calc = {
    head: formulaEngine.indicators,
    rows: formulaEngine.calculate(rows).toRows()
  };
  return append ? tableAcquire(table, calc) : calc
};

export { tableFormula };

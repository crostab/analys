import { Formula } from '@analys/formula';
import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { tableAcquire } from '@analys/table-merge';

const FUNC_REG = /\((.*?)\)\s+\{/s;
const LAMB_REG = /\(?(.*?)\)?\s+=>/s;
const WORD_REG = /\w+/g;

const words = phrase => {
  let ms,
      wd,
      ve = [];

  while ((ms = WORD_REG.exec(phrase)) && ([wd] = ms)) ve.push(wd);

  return ve;
};

const argnames = fn => {
  const text = fn.toString();
  let ms, ph;
  if ((ms = FUNC_REG.exec(text)) && ([, ph] = ms)) return words(ph);
  if ((ms = LAMB_REG.exec(text)) && ([, ph] = ms)) return words(ph);
  return [];
};

const tableFormula = function (formulae, {
  filter,
  append = true
} = {}) {
  const table = slice(this);

  if (filter) {
    tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;

  for (let indicator in formulae) if (formulae.hasOwnProperty(indicator)) {
    const func = formulae[indicator];
    const fields = argnames(func);
    const indexes = fields.map(name => head.indexOf(name), this);
    formulae[indicator] = [indexes, func];
  }

  const formulaEngine = new Formula(formulae);
  const calc = {
    head: formulaEngine.indicators,
    rows: formulaEngine.calculate(rows).toRows()
  };
  return append ? tableAcquire(table, calc) : calc;
};

export { tableFormula };

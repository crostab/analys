'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var formula = require('@analys/formula');
var tableFind = require('@analys/table-find');
var tableInit = require('@analys/table-init');
var tableMerge = require('@analys/table-merge');
var decoFunc = require('@spare/deco-func');

const tableFormula = function (formulae, {
  filter,
  append = true
} = {}) {
  const table = tableInit.slice(this);

  if (filter) {
    tableFind.tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;

  for (let indicator in formulae) if (formulae.hasOwnProperty(indicator)) {
    const func = formulae[indicator];
    const fields = decoFunc.argnames(func);
    const indexes = fields.map(name => head.indexOf(name), this);
    formulae[indicator] = [indexes, func];
  }

  const formulaEngine = new formula.Formula(formulae);
  const calc = {
    head: formulaEngine.indicators,
    rows: formulaEngine.calculate(rows).toRows()
  };
  return append ? tableMerge.tableAcquire(table, calc) : calc;
};

exports.tableFormula = tableFormula;

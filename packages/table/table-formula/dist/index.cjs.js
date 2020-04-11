'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var formula = require('@analys/formula');
var tableFind = require('@analys/table-find');
var tableInit = require('@analys/table-init');
var tableMerge = require('@analys/table-merge');

const tableFormula = function ({
  fields,
  formulas,
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
  fields = fields.map(name => head.indexOf(name), this);
  const formulaEngine = new formula.Formula(fields, formulas);
  const calc = {
    head: formulaEngine.indexes,
    rows: formulaEngine.calculate(rows).toRows()
  };
  return append ? tableMerge.tableAcquire(table, calc) : calc;
};

exports.tableFormula = tableFormula;

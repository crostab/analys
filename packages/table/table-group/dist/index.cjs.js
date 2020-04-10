'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tableFind = require('@analys/table-find');
var tableInit = require('@analys/table-init');
var tablespec = require('@analys/tablespec');
var group = require('@analys/group');
var chips = require('@analys/chips');
var table = require('@analys/table');
var matrix = require('@vect/matrix');
var mergeAcquire = require('@vect/merge-acquire');

const tableGroup = function ({
  key,
  field,
  filter
} = {}) {
  const table$1 = tableInit.slice(this);

  if (filter) {
    tableFind.tableFind.call(table$1, filter);
  }

  const {
    head,
    rows
  } = table$1;
  let groupHead;
  field = tablespec.parseField(field, key);
  const groupingEngine = matrix.isMatrix(field) // field |> deco |> says['parsed field']
  ? (groupHead = mergeAcquire.acquire([key], field.map(entry => entry[0])), new group.Group(head.indexOf(key), field.map(([key, mode]) => [head.indexOf(key), mode]))) : (groupHead = [key, field[0]], new chips.Chips(head.indexOf(key), head.indexOf(field[0]), field[1]));
  return new table.Table(groupHead, groupingEngine.record(rows).toRows());
};

exports.tableGroup = tableGroup;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chips = require('@analys/chips');
var group = require('@analys/group');
var tableFind = require('@analys/table-find');
var tableInit = require('@analys/table-init');
var tablespec = require('@analys/tablespec');
var matrix = require('@vect/matrix');
var mergeAcquire = require('@vect/merge-acquire');

const tableGroup = function ({
  key,
  field,
  filter,
  alias
} = {}) {
  const table = tableInit.slice(this);

  if (filter) {
    tableFind.tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;
  let groupHead, label, pick, mode;
  [key, pick] = tablespec.parseKeyOnce(key);
  const groupingEngine = matrix.isMatrix(field = tablespec.parseField(field, key)) // field |> deco |> says['parsed field']
  ? (groupHead = mergeAcquire.acquire([key], field.map(([label]) => label)), new group.Group([head.indexOf(key), pick], field.map(([label, mode]) => [head.indexOf(label), mode]))) : ([label, mode] = field, groupHead = [key, label], new chips.Chips([head.indexOf(key), pick], [head.indexOf(label), mode]));
  if (alias) for (let [field, proj] of Object.entries(alias)) {
    const i = groupHead.indexOf(field);
    if (i > 0) groupHead[i] = proj;
  }
  return {
    head: groupHead,
    rows: groupingEngine.record(rows).toRows()
  };
};

exports.tableGroup = tableGroup;

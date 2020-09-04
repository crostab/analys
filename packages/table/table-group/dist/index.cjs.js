'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chips = require('@analys/chips');
var group = require('@analys/group');
var tableFind = require('@analys/table-find');
var tableInit = require('@analys/table-init');
var tablespec = require('@analys/tablespec');
var vectorMerge = require('@vect/vector-merge');

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
  let groupHead, label, to, mode;
  [{
    key,
    to
  }] = tablespec.parseField(key);
  const groupingEngine = (field = tablespec.parseField.call({
    key
  }, field)).length > 1 // field |> deco |> says['parsed field']
  ? (groupHead = vectorMerge.acquire([key], field.map(({
    key: label
  }) => label)), new group.Group([head.indexOf(key), to], field.map(({
    key: label,
    to: mode
  }) => [head.indexOf(label), mode]))) : ([{
    key: label,
    to: mode
  }] = field, groupHead = [key, label], new chips.Chips([head.indexOf(key), to], [head.indexOf(label), mode]));
  if (alias) for (let [field, proj] of Array.isArray(alias) ? alias : Object.entries(alias)) {
    const i = groupHead.indexOf(field);
    if (i > 0) groupHead[i] = proj;
  }
  return {
    head: groupHead,
    rows: groupingEngine.record(rows).toRows()
  };
};

exports.tableGroup = tableGroup;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crostab = require('@analys/crostab');
var cubic = require('@analys/cubic');
var tablespec = require('@analys/tablespec');

/**
 * @typedef {string|number} str
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 * @param {str|str[]|Object<str,Function>|[string,Function][]} side
 * @param {str|str[]|Object<str,Function>|[string,Function][]} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object<string|number,function(*?):boolean>} [filter]
 * @param {function():number} [formula] - formula is valid only when cell is CubeCell array.
 */

/**
 *
 * @param {Table|TableObject} table
 * @returns {CrosTab}
 */

const tablePivot = function (table) {
  const {
    side,
    banner,
    field,
    formula
  } = this;
  const {
    head,
    rows
  } = table;

  const parseConf = keyConf => tablespec.parseField(keyConf).map(({
    key,
    to
  }) => ({
    key: head.indexOf(key),
    to
  }));

  const sideConf = parseConf(side),
        bannerConf = parseConf(banner),
        fieldConf = parseConf(field);
  const pivotEngine = cubic.Cubic.build(sideConf, bannerConf, fieldConf);
  const crostab$1 = crostab.CrosTab.from(pivotEngine.record(rows).toObject());

  if (formula) {
    if (fieldConf.length === 1) crostab$1.mutate(el => formula.call(null, el));
    if (fieldConf.length > 1) crostab$1.mutate(vec => formula.apply(null, vec));
  }

  return crostab$1;
};

exports.tablePivot = tablePivot;
